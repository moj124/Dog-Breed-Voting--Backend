// const fetchP = import('node-fetch').then(mod => mod.default)
// const fetch = (...args: any[]) => fetchP.then(fn => fn(...args))
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getData(){
  try {
    const response = await fetch( `https://api.thedogapi.com/v1/breeds`);
    // console.log(await response.json())
    return response.json()
  } catch (error) {
    console.log(error);
  }
}