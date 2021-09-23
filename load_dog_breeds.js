// const fetchP = import('node-fetch').then(mod => mod.default)
// const fetch = (...args: any[]) => fetchP.then(fn => fn(...args))
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getData(){
  try {
    const response = await fetch( `https://api.thedogapi.com/v1/breeds`);
    let breeds = await response.json()
    breeds = breeds.map(element => {'name':element.name})
    console.log(await breeds)
  } catch (error) {
    console.log(error);
  }
}
getData()