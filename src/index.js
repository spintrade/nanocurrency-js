/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2018 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import Native from '../native'

let instance = null
let _generateWork = null
let _validateWork = null
let _generateSeed = null
let _computeSecretKey = null
let _computePublicKey = null
let _computeAddress = null
export function init () {
  return new Promise((resolve, reject) => {
    try {
      Native().then(native => {
        instance = native
        _generateWork = instance.cwrap('emscripten_generate_work', 'string', ['string', 'number', 'number'])
        _validateWork = instance.cwrap('emscripten_validate_work', 'number', ['string', 'string'])
        _generateSeed = instance.cwrap('emscripten_generate_seed', 'string', [])
        _computeSecretKey = instance.cwrap('emscripten_compute_secret_key', 'string', ['string', 'number'])
        _computePublicKey = instance.cwrap('emscripten_compute_public_key', 'string', ['string'])
        _computeAddress = instance.cwrap('emscripten_compute_address', 'string', ['string'])
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

const checkNotInitialized = () => {
  if (instance === null) throw new Error('NanoCurrency is not initialized')
}

export function generateWork (blockHash, workerNumber = 0, workerCount = 1) {
  checkNotInitialized()

  const work = _generateWork(blockHash, workerNumber, workerCount)

  return work !== '0000000000000000' ? work : null
}

export function validateWork (blockHash, work) {
  checkNotInitialized()

  const valid = _validateWork(blockHash, work) === 1

  return valid
}

export function generateSeed () {
  checkNotInitialized()

  const seed = _generateSeed()

  return seed
}

export function computeSecretKey (seed, index) {
  checkNotInitialized()

  const secretKey = _computeSecretKey(seed, index)

  return secretKey
}

export function computePublicKey (secretKey) {
  checkNotInitialized()

  const publicKey = _computePublicKey(secretKey)

  return publicKey
}

export function computeAddress (publicKey) {
  checkNotInitialized()

  const address = _computeAddress(publicKey)

  return address
}
