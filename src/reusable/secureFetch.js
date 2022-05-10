export default function secureFetch(url, data) {
  return new Promise((resolve, reject) => {
    fetch(url, data).then(response => {
      // response only can be ok in range of 2XX
      if (response.ok) {
        resolve(response);
      } else {
        switch (response.status) {
          case 401:
            console.log('Unaurhorized')
            break;
          case 404:
            console.log('Object not found');
            break;
          case 500:
            console.log('Internal server error');
            break;
          default:
            console.log('Some error occured');
            break;
        }
        reject(response);
      }
    })
  });
}