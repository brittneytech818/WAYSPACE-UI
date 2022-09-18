import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button, SpinnerOG } from '@zoralabs/zord'
import { useERC721DropContract } from 'providers/ERC721DropProvider'
import { useAccount, useNetwork } from 'wagmi'
import { waitingApproval } from 'styles/styles.css'
import { useSaleStatus } from '@hooks/useSaleStatus'

const MintButtonStyles = ({
  isMinted,
  buttonText,
  onClick,
  awaitingApproval,
  isMinting,
  collection,
}) => {
  const presale = false
  const { switchNetwork } = useNetwork()
  const { data: account } = useAccount()
  const { chainId, correctNetwork } = useERC721DropContract()
  const { saleNotStarted } = useSaleStatus({
    collection,
    presale,
  })

  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <Button
          icon={isMinted ? 'Check' : undefined}
          iconSize="sm"
          size="lg"
          variant={
            account == null
              ? undefined
              : !correctNetwork
              ? 'destructive'
              : saleNotStarted
              ? 'secondary'
              : undefined
          }
          onClick={
            !account
              ? openConnectModal
              : !correctNetwork
              ? () => switchNetwork?.(chainId)
              : onClick
          }
          style={isMinted ? { backgroundColor: '#1CB687' } : {}}
          className={awaitingApproval ? waitingApproval : ''}
          disabled={
            isMinting || awaitingApproval || (account && correctNetwork && saleNotStarted)
          }
        >
          {isMinting ? (
            <SpinnerOG />
          ) : !account ? (
            'Connect wallet'
          ) : !correctNetwork ? (
            'Wrong network'
          ) : awaitingApproval ? (
            'Confirm in wallet'
          ) : isMinted ? (
            'Minted'
          ) : saleNotStarted ? (
            'Not started'
          ) : (
            buttonText
          )}
        </Button>
      )}
    </ConnectButton.Custom>
  )
}

export default MintButtonStyles
