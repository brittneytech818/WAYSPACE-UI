import { ethers, utils } from 'ethers'
import { GetStaticProps } from 'next'
import { ipfsImage } from '@lib/helpers'
import abi from '@lib/WAYSPACE-abi.json'
import getDefaultProvider from '@lib/getDefaultProvider'
import getDrop from '@lib/getDrop'
import { allChains } from 'wagmi'
import HomePage from '@components/HomePage/HomePage'
const axios = require('axios').default;

const MintPage = () => <HomePage />
export default MintPage;
