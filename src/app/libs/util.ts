import {HttpHeaders} from '@angular/common/http';
/**
 * Created by mathias on 12/7/17.
 */
declare const window;

export module Connection {

  export function get(url: string | {}, username: string = '', password: string = '') {
    const https = window.require('https');
    https.globalAgent.maxCachedSessions = 0;
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'] + '';
        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          // consume response data to free up memory
          error.status = statusCode;
          res.resume();
          reject(error);
          return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          res.resume();
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            reject(e.messag);
          }
        });
      }).on('error', (e) => {
        console.log(e);
        reject(e.messag);
      });
    });
  }

  export function post(url: {}, postData: any) {
    const https = window.require('https');
    url['method'] = 'POST';
    https.globalAgent.maxCachedSessions = 0;
    return new Promise((resolve, reject) => {
      console.log('1');
      const req = https.request(url, (res) => {
        console.log('7.1');
        console.log(res);

        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'] + '';
        let error;
        if (statusCode < 200 || statusCode >= 300) {
          error = new Error('Request Failed.\n' +
            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          // consume response data to free up memory

          res.resume();
          res.destroy();
          reject(error);
          return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          res.destroy();
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            reject(e.messag);
          }
          return true;
        });
      });
      console.log('2');
      req.on('error', (e) => {
        console.log(e);
        reject(e.messag);
      });
      console.log('3: ' + JSON.stringify(postData));
      req.write(JSON.stringify(postData));
      console.log('4');
      req.end();
      console.log('5');
    });
  }
}

