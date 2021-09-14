import {
   IBuildState,
   IEnvoy,
   IPlugin,
   IStep } from '@spikedpunch/forge'

import { Readable, Writable, Transform } from 'readable-stream'
import { GmailReadStreamOptions, GmailWriteStreamOptions } from './GoogleStreamOptions'
import { GmailReadableStream } from './Readable'
import { google } from 'googleapis'
import { GoogleAuth, JWT, OAuth2Client } from 'google-auth-library'
import * as fs from 'fs-extra'
import { GmailCreateStream } from './Writable'
import { GoogleRateLimiter, IGoogleRateLimiter } from './RateLimiter'


export class GoogleEnvoy implements IEnvoy {
   data: any
   metadata: any
   readonly options: GooglePluginOptions

   constructor(options: GooglePluginOptions) {
      this.options = options
   }
}

export type GoogleAuthJwt = {
   credsFile: string   // Relative path to the credential.json file
}

export type GoogleAuthOauth2 = {
   clientId: string
   clientSecret: string
   redirectUrl: string
   refreshToken: string
}

export type GooglePluginAuth = {
   jwt?: GoogleAuthJwt
   oauth2?: GoogleAuthOauth2
}

export type GooglePluginOptions = {
   auth: GooglePluginAuth
   email: string
   rateLimiter?: IGoogleRateLimiter
}

export class GmailPlugin implements IPlugin {
   readonly name: string = 'forge-plugin-gmail'
   readonly options: GooglePluginOptions
   readonly rateLimiter: IGoogleRateLimiter

   constructor(options: GooglePluginOptions) {
      if(options == null) {
         throw new Error(`No GooglePluginOptions provided for the Google Plugin`)
      }

      this.options = options
      this.rateLimiter = options.rateLimiter || new GoogleRateLimiter()
   }

   async read(state: IBuildState, step: IStep): Promise<Readable> {
      let options = GmailReadStreamOptions.fromStep(step.info, this.options)
      
      let auth = await this.createAuthClient(state, this.options)

      if(auth === undefined) {
         throw new Error(`No authentication provided for a GMail step. Ensure that credentials are provided.`)
      }

      return new GmailReadableStream(
         options,
         auth,
         options.userId || this.options.email,
         options.streamOptions
      )
   }

   async write(state: IBuildState, step: IStep): Promise<Writable> {
      let options = GmailWriteStreamOptions.fromStep(step.info)

      let auth = await this.createAuthClient(state, this.options)

      if(auth === undefined) {
         throw new Error(`No authentication provided for a GMail step. Ensure that credentials are provided.`)
      }

      return new GmailCreateStream(
         options,
         auth,
         options.streamOptions
      )
   }

   transform(state: IBuildState, step: IStep): Promise<Transform> {
      throw new Error(`Method not implemented. alias: ${step.alias}`)
   }

   private async createAuthClient(state: IBuildState, options: GooglePluginOptions): Promise<JWT | GoogleAuth | OAuth2Client | undefined> {
      if(options.auth.jwt != null) {
         let keyFile = await state.findFile(options.auth.jwt.credsFile)
         
         if(keyFile === undefined) {
            throw new Error(`Could not find key file ${options.auth.jwt.credsFile} for GMail step.`)
         }

         let creds = await fs.readJson(keyFile)

         let auth = new google.auth.JWT({
            email: creds.client_email,
            key: creds.private_key,
            keyId: creds.private_key_id,
            scopes: [
               'https://mail.google.com/',
               'https://www.googleapis.com/auth/gmail.modify',
               'https://www.googleapis.com/auth/gmail.readonly',
            ],
            subject: this.options.email
         })
   
         await (auth as JWT).authorize()
         return auth
      }

      if(options.auth.oauth2 != null) {
         let auth = new OAuth2Client(
            options.auth.oauth2.clientId,
            options.auth.oauth2.clientSecret,
            options.auth.oauth2.redirectUrl
         )

         auth.setCredentials({
            refresh_token: options.auth.oauth2.refreshToken
         })

         return auth
      }

      return undefined
   }
}