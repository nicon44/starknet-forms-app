import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import FormAbi from '../abi/formAbi.json'

export function useFormContract() {
  return useContract({
    abi: FormAbi as Abi,
    address: '0x004820e0c0c0ad748798c94a619c99f94c36814af5ec6fe6b16a6cc8b867aa9f',
  })
}