/*
 * Copyright (c) 2020, Phoenix Contact GmbH & Co. KG
 * Licensed under the Apache License, Version 2.0
*/

type ReplacerFunction = (key: string, value: any) => any;

export default class RestClientBase {
    private url: string;

    constructor(host: string, port: number) {
        let protocol: string;

        // Wenn das Protokoll im Browser verfügbar ist
        if (typeof window !== "undefined" && window.location.protocol) {
            protocol = window.location.protocol.replace(":", ""); // "http" oder "https"
        }
        // Fallback, falls kein Protokoll gesetzt wurde und hoffentlich der Port passt
        if (!protocol) {
            protocol = (port === 443 || port === 444) ? "https" : "http";
        }
        // Setzen des Ports 443 explizit. Das passiert bei https wenn der Browser den Port als default https Port weg lässt.
        // Alle anderen für https genutzen Ports (wie z.b. 444) werden wieder normal übergeben.
        if ((port <= 0 || isNaN(port) || port === 80) && protocol === "https") {
            port = 443;
        }
        this.url = `${protocol}://${host}:${port}`;
    }

    public updateUrl(url: string): void {
        this.url = url;
    }

    public get<T>(path: string, errorInstance: T): Promise<T> {
        return fetch(this.url + path)
            .then((results) => results.json())
            .catch((e) => {
                console.log(e);
                return errorInstance;
            });
    }

    public put<R, T>(path: string, request: R, errorInstance: T, replacer: ReplacerFunction = null): Promise<T> {
        return fetch(this.url + path, {
            body: JSON.stringify(request, replacer),
            headers: {
                "content-type": "application/json",
              },
            cache: "no-cache",
            method: "PUT",
          })
          .then((results) => results.json())
          .catch((e) => {
                  console.log(e);
                  return errorInstance;
              });
    }

    public post<R, T>(path: string, request: R, errorInstance: T, replacer: ReplacerFunction = null): Promise<T> {
        const body = JSON.stringify(request, replacer);
        return fetch(this.url + path, {
            body,
            headers: {
                "content-type": "application/json",
              },
            cache: "no-cache",
            method: "POST",
          })
          .then((results) => results.json())
          .catch((e) => {
                  console.log(e);
                  return errorInstance;
              });
    }

    public postNoBody<T>(path: string, errorInstance: T): Promise<T> {
        return fetch(this.url + path, {
            cache: "no-cache",
            method: "POST",
          })
          .then((results) => results.json())
          .catch((e) => {
                  console.log(e);
                  return errorInstance;
              });
    }

    public delete<R, T>(path: string, request: R, errorInstance: T, replacer: ReplacerFunction = null): Promise<T> {
        return fetch(this.url + path, {
            body: JSON.stringify(request, replacer),
            headers: {
                "content-type": "application/json",
              },
            cache: "no-cache",
            method: "DELETE",
          })
          .then((results) => results.json())
          .catch((e) => {
                  console.log(e);
                  return errorInstance;
              });
    }

    public deleteNoBody<T>(path: string, errorInstance: T): Promise<T> {
        return fetch(this.url + path, {
            headers: {
                "content-type": "application/json",
              },
            cache: "no-cache",
            method: "DELETE",
          })
          .then((results) => results.json())
          .catch((e) => {
                  console.log(e);
                  return errorInstance;
              });
    }
}
