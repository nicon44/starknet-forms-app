import { useContract } from '@starknet-react/core'
import { Abi } from 'starknet'

import FormAbi from '../abi/formAbi.json'

export function useFormContract() {
  return useContract({
    abi: FormAbi as Abi,
    address: '0x076c82542aeb0fdc6d01009b2012e73ce3e0e879172231fff3cd4acc940900f6',
  })
}