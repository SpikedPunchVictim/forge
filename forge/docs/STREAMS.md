
# Stream Best Practices

This document is a WIP.


**References**
* [Lifecycle of pipe()](https://nodejs.org/es/docs/guides/backpressuring-in-streams/#lifecycle-of-pipe)


**Best Practices**

* Never .push() if you are not asked.
* Never call .write() after it returns false but wait for 'drain' instead.
* Streams changes between different Node.js versions, and the library you use. Be careful and test things.

## Readable

| Event | callback                     | Description                                                      |
| ----- | ---------------------------- | ---------------------------------------------------------------- |
| close |                              | Stream is done. No more events will be emitted                  |
| data  | chunk {Buffer, string, any } | The 'data' event is emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer. This may occur whenever the stream is switched in flowing mode by calling readable.pipe(), readable.resume(), or by attaching a listener callback to the 'data' event. The 'data' event will also be emitted whenever the readable.read() method is called and a chunk of data is available to be returned. |
| end   |               | Emitted when there's no more data to be consumed from the stream |

&nbsp;

* Call `push(data)` to forward the next set of data
* When done, call `push(null)`. No more data can be written, and any buffered data is flushed.
* When a read errors, call `destroy(err)`

## Writable

**Methods**

_write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void