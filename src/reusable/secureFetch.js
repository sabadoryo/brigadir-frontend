export default function secureFetch(url, data) {
  return new Promise((resolve, reject) => {
    fetch(url, data).then(response => {
      // response only can be ok in range of 2XX
      if (response.ok) {
        // you can call response.json() here too if you want to return json
        resolve(response);
      } else {
        // localStorage.removeItem('token')
        // window.location.href = "/"
        switch (response.status) {
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

        //here you also can thorow custom error too
        reject(response);
      }
    })
    .catch(error => {
      //it will be invoked mostly for network errors
      //do what ever you want to do with error here
      console.log(error);
      reject(error);
    });
  });
}