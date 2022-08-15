import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import FormAbi from '../abi/formAbi.json'

export function useFormContract() {
  return useContract({
    abi: FormAbi as Abi,
    address: '0x0651fb4e2f0a4188dc35eb9d07724374d2d4bba12da21f52d3ee092505ab8bd0',
  })
}