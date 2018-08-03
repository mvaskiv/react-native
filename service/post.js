// export function PostData(type, data) {
//     let BaseURL = 'http://lastminprod.com/Matcha/public/';
//     return new Promise((resolve, reject) => {
//         fetch(BaseURL+type, {
//             method: 'POST',
//             // mode: 'no-cors',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data)
//         })
//         .then((response) => response.json())
//         .then((res) => {
//             console.log(res);
//             resolve(res);
//         })
//         .catch((error) => {
//             reject(error);
//         });
//     });
// }

export function PostData(type, data) {
    fetch('http://lastminprod.com:8100/Matcha/public/users', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            start: 0,
            number: 15,
            sort: 'age'
        })
    })
    .then((response) => response.json())
    .then((res) =>
    {
        return res;
    })
    .catch((error) => {
        console.error(error);
    });
}