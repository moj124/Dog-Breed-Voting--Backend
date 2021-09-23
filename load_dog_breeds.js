const fetchP = import('node-fetch').then(mod => mod.default)
const fetch = (...args) => fetchP.then(fn => fn(...args))

export async function getData(){
  try {
    const response = await fetch( `https://api.thedogapi.com/v1/breeds`);
    // console.log(await response.json())
    return await response.json()
  } catch (error) {
    console.log(error);
  }
}