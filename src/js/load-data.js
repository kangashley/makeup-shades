let shadeData = null
let brandDict = null
let groupDict = null

let brandMap = null

function loadDictionaries(){
  const path = 'assets/data'
  const names = ['brand_dictionary', 'group_dictionary']
  const files = names.map(d => `${path}/${d}.csv`)

  return new Promise((resolve, reject) => {
    d3.loadData(...files, (err, response) => {
      if (err) reject(err)
      else resolve(response)
    })
  })
}

function setupDictionaries(response){
  brandDict = response[0]
  groupDict = response[1]

  brandMap = d3.map(brandDict, d => {
    return d.brand_short
  })
}

function findProduct(brand, product){

  const specificProducts = brandDict.filter(d => d.brand_short == brand)

  const productMap = d3.map(specificProducts, d => {
    return d.foundation_short
  })

  const wantedProduct = productMap.get(product).foundation

  return wantedProduct
}

function defineBin(value){
  switch(true){
    // Lightness > 90
    case value >= 90:
      return 9;
      break;
    // Lightness < 90 but > 80
    case value >= 80:
      return 8;
      break;
    // Lightness < 80 but > 70
    case value >= 70:
      return 7;
      break;
    //Lightness < 70 but > 60
    case value >= 60:
      return 6;
      break;
    case value >= 50:
      return 5;
      break;
    case value >= 40:
      return 4;
      break;
    case value >= 30:
      return 3;
      break;
    case value >= 20:
      return 2;
      break;
    case value >= 10:
      return 1;
      break;
    default:
      return 0
  }
}


function loadShades(){
  const file = 'assets/data/shades.csv'

  return new Promise((resolve, reject) => {
    d3.loadData(file, (err, response) => {
      if(err) reject(err)
      shadeData = cleanData(response[0])
      resolve(shadeData)
    })
  })

}



function cleanData(data){
  return data.map(d => ({
    ...d,
    brand_short: d.brand,
    brand: brandMap.get(d.brand).brand,
    product_short: d.product,
    product: findProduct(d.brand, d.product),
    hex: d.hex,
    H: +d.H,
    S: +d.S,
    V: +d.V,
    L: +d.L,
    group: d.group,
    lightnessGroup: defineBin(+d.L)
  }))
}

function handleError(error){
	console.error(error)
}

function loadAll(cb){
  loadDictionaries()
    .then(response => {
      setupDictionaries(response)
      loadShades()
    })
    .catch(handleError)
}

function init(){

  return new Promise((resolve, reject) => {
    loadDictionaries()
      .then(response => {
          setupDictionaries(response)
        })
        .then(response => {
          resolve(loadShades())
        })
        .catch(handleError)
})


}

export default init
