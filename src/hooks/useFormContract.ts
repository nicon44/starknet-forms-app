import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import FormAbi from '../abi/formAbi.json'

export function useFormContract() {
  return useContract({
    abi: FormAbi as Abi,
    address: '0x026ed759c2ece6db9847022f45fd592bab448e138dca8262eebcda32dddd93b0',
  })
}