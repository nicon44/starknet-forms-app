import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import FormAbi from '../abi/formAbi.json'

export function useFormContract() {
  return useContract({
    abi: FormAbi as Abi,
    address: '0x4ce0ec61da6c8e03c186a49e8b35a6448c2486f15385969e7bf4563eed9bab9',
  })
}