import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Col, Menu, Popover, Row, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import styled from 'styled-components';
import { useWallet } from '../utils/wallet';
import { ENDPOINTS, useConnectionConfig } from '../utils/connection';
import Settings from './Settings';
import CustomClusterEndpointDialog from './CustomClusterEndpointDialog';
import { EndpointInfo } from '../utils/types';
import { notify } from '../utils/notifications';
import { Connection } from '@solana/web3.js';
import WalletConnect from './WalletConnect';
import AppSearch from './AppSearch';
import { getTradePageUrl } from '../utils/markets';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0px 30px;
  flex-wrap: wrap;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #99CCFF;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  img {
    height: 30px;
    margin-right: 8px;
  }
`;

const EXTERNAL_LINKS = {
  '/learn': 'https://docs.projectserum.com/trade-on-serum-dex/trade-on-serum-dex-1',
  '/add-market': 'https://serum-academy.com/en/add-market/',
  '/wallet-support': 'https://serum-academy.com/en/wallet-support',
  '/dex-list': 'https://serum-academy.com/en/dex-list/',
  '/developer-resources': 'https://serum-academy.com/en/developer-resources/',
  '/explorer': 'https://solscan.io',
  '/srm-faq': 'https://projectserum.com/srm-faq',
  '/swap': 'https://swap.projectserum.com',
};

export default function TopBar() {
  const { connected, wallet } = useWallet();
  const {
    endpoint,
    endpointInfo,
    setEndpoint,
    availableEndpoints,
    setCustomEndpoints,
  } = useConnectionConfig();
  const [addEndpointVisible, setAddEndpointVisible] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const [searchFocussed, setSearchFocussed] = useState(false);

  const handleClick = useCallback(
    (e) => {
      if (!(e.key in EXTERNAL_LINKS)) {
        history.push(e.key);
      }
    },
    [history],
  );

  const onAddCustomEndpoint = (info: EndpointInfo) => {
    const existingEndpoint = availableEndpoints.some(
      (e) => e.endpoint === info.endpoint,
    );
    if (existingEndpoint) {
      notify({
        message: `An endpoint with the given url already exists`,
        type: 'error',
      });
      return;
    }

    const handleError = (e) => {
      console.log(`Connection to ${info.endpoint} failed: ${e}`);
      notify({
        message: `Failed to connect to ${info.endpoint}`,
        type: 'error',
      });
    };

    try {
      const connection = new Connection(info.endpoint, 'recent');
      connection
        .getBlockTime(0)
        .then(() => {
          setTestingConnection(true);
          console.log(`testing connection to ${info.endpoint}`);
          const newCustomEndpoints = [
            ...availableEndpoints.filter((e) => e.custom),
            info,
          ];
          setEndpoint(info.endpoint);
          setCustomEndpoints(newCustomEndpoints);
        })
        .catch(handleError);
    } catch (e) {
      handleError(e);
    } finally {
      setTestingConnection(false);
    }
  };

  const endpointInfoCustom = endpointInfo && endpointInfo.custom;
  useEffect(() => {
    const handler = () => {
      if (endpointInfoCustom) {
        setEndpoint(ENDPOINTS[0].endpoint);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [endpointInfoCustom, setEndpoint]);

  const tradePageUrl = location.pathname.startsWith('/market/')
    ? location.pathname
    : getTradePageUrl();

  return (
    <>
      <CustomClusterEndpointDialog
        visible={addEndpointVisible}
        testingConnection={testingConnection}
        onAddCustomEndpoint={onAddCustomEndpoint}
        onClose={() => setAddEndpointVisible(false)}
      />
      <Wrapper>
        <LogoWrapper onClick={() => history.push(tradePageUrl)}>
          <img src={logo} alt="" />
          {'StarAtlas.Exchange'}
        </LogoWrapper>
        <Menu
          mode="horizontal"
          onClick={handleClick}
          selectedKeys={[location.pathname]}
          style={{
            borderBottom: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            flex: 1,
          }}
        >
          <Menu.Item key={tradePageUrl} style={{ margin: '0 10px 0 20px' }}>
            TRADE
          </Menu.Item>

          <Menu.SubMenu title="TOKENS">
              <Menu.Item key="Di66GTLsV64JgCCYGVcY21RZ173BHkjJVgPyezNN7P1K">Star Atlas | ATLAS/USDC </Menu.Item>
              <Menu.Item key="HxFLKUAmAMLz1jtT3hbvCMELwH5H9tpM2QugP8sKyfhW">Star Atlas DAO | POLIS/USDC </Menu.Item>
              <Menu.Item key="6fk7SnxrF69fPkfMNnkjPXbxsqd8xzDfNpGWbtcdfhFX">Star Atlas DAO | POLIS/ATLAS</Menu.Item>
              <Menu.Item key="6CGu3JKkqrcuRL1GajAwPoRqvkNcASpC6v9nqLtAuerk">Club City | CLUBCITY/ATLAS</Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu title="SHIP" >
            <Menu.ItemGroup title="XX-SMALL">
              <Menu.Item key="4hTAszj9mf1UZCsnKsjskaZZZi7cwSzduNSkRkT7LxVS">PEARCE X4 | PX4/ATLAS</Menu.Item>
              <Menu.Item key="DGZDondoRbkWNG9QsTPWPhjRLiBUDFt5a4Bd7UeFcFgM">PEARCE X4 | PX4/SOL</Menu.Item>
              <Menu.Item key="3VgNHb8ZMcMtEzb64EQkiVbknER9T97m23gWtTUMYxr9">OPAL JET | OPALJ/ATLAS</Menu.Item>
              <Menu.Item key="9x3RZgc8pTSu2k1k99otNKQAT4aHEzX247jmLV8fDNdr">OPAL JET | OPALJ/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="X-SMALL">
              <Menu.Item key="HMDKErK8ehzFXVAKXBcmMjQM9fayRmmLbbeCU4bkZqSQ">PEARCE X5 | PX5/ATLAS</Menu.Item>
              <Menu.Item key="3Nbb7sYxSSQdUgtjuamBq5FN7sABSQxV3MT7GXMNju8D">PEARCE X5 | PX5/SOLDEV</Menu.Item>
              <Menu.Item key="GZxCfVkCgSRbHWmUCsqjVw9ChQ6DuLLiViFP8ZTihHQN">OPAL JETJET | OPALJJ/ATLAS</Menu.Item>
              <Menu.Item key="5pfPKFVc7j6NsRKtWgFvZFgmTwvx3yRR4jveWesRGrDp">OPAL JETJET | OPALJJ/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="MEDIUM">
              <Menu.Item key="EiqSPmjCSiDNp9Bx5dy5Tj6KBENTiWKvehTbvy4uxCoN">VZUS OPOD | VZUSOP/ATLAS</Menu.Item>
              <Menu.Item key="HWA1vXeoQeJB45XVjMiqDGTmhWdKiVd7hJ1JB8DeNJKG">VZUS OPOD | VZUSOP/SOLDEV</Menu.Item>
              <Menu.Item key="J9C3Jm9FW84f2SrrR7RbwNiB6nTGPqQHziEW59LXzC1w">FIMBUL BYOS PACKLITE | FBLBPL/ATLAS</Menu.Item>
              <Menu.Item key="Fe6X94DhHrZrycVn9MXkdTPs9vRAEk9rNo2poxxbrVmP">FIMBUL BYOS PACKLITE | FBLBPL/SOLDEV</Menu.Item>
              <Menu.Item key="5dBAR3FAq1c84RoYegBP5LgRevh9MgMnuzph9tbSKust">CALICO COMPAKT HERO | CALCH/ATLAS</Menu.Item>
              <Menu.Item key="AwyUckHC2LsJX7Wovz8qwC1wb1pnEs97rmW5VsSj7uwX">CALICO COMPAKT HERO | CALCH/SOLDEV</Menu.Item>
              <Menu.Item key="GCdy6NXGvn4FCq9ckBScRPmkXrnanvQkBGqV94oEQfhd">PEARCE F4 | PF4/ATLAS</Menu.Item>
              <Menu.Item key="G3cDhTZzabiEdeR8BQDvyzHwNkY7qCV6HPv9WQnWhpDT">RAINBOW OM | OM/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="LARGE">
              <Menu.Item key="B8qmL3DTeaWjLKdvWT1cDaX6oMi8agxNdhTEXXAwiKMV">OGRIKA THRIPID | OGKATP/ATLAS</Menu.Item>
              <Menu.Item key="DboZYgZLpfVqDTPopM8uWpWLPRV59fdgG2gX9ePBANC2">OGRIKA THRIPID | OGKATP/SOLDEV</Menu.Item>
              <Menu.Item key="26ZjhQ3iGDTDDb5bPCfuHHjsg2Sn9kgKd4VsYKe5JeEH">FIMBUL ECOS GREENADER | FBLEGR/ATLAS</Menu.Item>
              <Menu.Item key="2RiU8jCdbtHRQJBdudxixQP2AHJ3JyxFbbB9Libhghxv">PEARCE R8 | PR8/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="CAPITAL">
              <Menu.Item key="FCAxtCmtvP4jEpadLqbKJo2NGsqa8waVGKbzpZTMuF7R">CALICO GUARDIAN | CALG/ATLAS</Menu.Item>
              <Menu.Item key="6ghBtX4c28w2AWG6c972dp3Hr8WFE8dHXgg51yvvMfWq">CALICO GUARDIAN | CALG/SOLDEV</Menu.Item>
              <Menu.Item key="AbeLR47D11GmTSFv3DHkjXxpSoChoWgwt13rv35VjLzj">PEARCE C9 | PC9/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="COMMANDER">
              <Menu.Item key="Gv49Xiq1agE7Z2GiPzaPWArfa4Rmyv5zEFrabs6GqatL">PEARCE C11 | PC11/ATLAS</Menu.Item>
              <Menu.Item key="7T4duApjDUsmfLhUSPwMQHwkB3Nfeyb4MLHzRkdQa2cN">FIMBUL ECOS TREEARROW | FBLETR/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="SMALL">
              <Menu.Item key="DNkUocbtus7RWWZn1uU2KHy6hAuhxinNumZd4Ep9ECEk">VZUS AMBWE | VZUSAM/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="SMALL">
              <Menu.Item key="GVnHHohvrKy234cJAdq4V2ChkB7tQ5PqGbcHyAxrcHAS">TUFA FEIST | TUFAFE/ATLAS</Menu.Item>
              <Menu.Item key="HdZMiR2FDGVBQ9736Pjh25G2Gjg6agah71WExG1WfZVV">PEARCE X6 | PX6/ATLAS</Menu.Item>
              <Menu.Item key="3MLqsH5mnVFvB4mQr3afpWFSUNuqiimcnAi9uwPVGiV5">RAINBOW CHI | CHI/ATLAS</Menu.Item>
              <Menu.Item key="4VomCWY7Ng7oe1Uzw59GJMBoDHepahn9Ad4GSBzcnDDy">FIMBUL BYOS EARP | FBLBEA/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="CAPITAL">
              <Menu.Item key="7atB5CpD7ymDnrU56HB2PGzgcycb6iX2uKwHJx6Q8GQj">FIMBUL ECOS BOMBARELLA | FBLEBO/ATLAS</Menu.Item>
              <Menu.Item key="3V2weox7JdxumjPKwWQUX7DzRodz7X5UGHC74aCzyjnA">OGRIKA JOD ASTERIS | OGKAJA/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="MEDIUM">
              <Menu.Item key="9a1VYzSPnSiTwnrHccfMrb2eFbqQyaU1utHt9rHiwbKq">CALICO EVAC | CALEV/ATLAS</Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
          <Menu.SubMenu title="COLLECTIBLE" >
            <Menu.ItemGroup title="SKIN">
              <Menu.Item key="2zt535DiD7BwJuiQwpuJhWgc5Fn7jHhF3z2iticYzmLM">NANOBYTE | PX4SNB/SOLDEV</Menu.Item>
              <Menu.Item key="BSiqBYLviEVHarBuWfAuyFmby6c2gDt2hmW4FHsKBUqc">SPACER | PX5SSP/SOLDEV</Menu.Item>
              <Menu.Item key="CyJ2dVg2XcKxMm84XVM7oJY7XkzRVAeiodzYkVPp1sDh">SPHINX | TIGUSS/SOLDEV</Menu.Item>
              <Menu.Item key="J7gBRmo7bEykMgJrjTUXSAAcDSpBg78gudt7NVUNQhDH">B.O.B. | OJJSBB/SOLDEV</Menu.Item>
              <Menu.Item key="AQyct4z9orS4Q8jmJ14rBnDdMzbY9PKTuwoyJqjqoEKi">USTURN | VOPSUS/SOLDEV</Menu.Item>
              <Menu.Item key="BWqRZXgFfFp95PXWEZEbqtiHdCn7vSnuBdB5EBVq88dk">LONE STAR | FBPLSL/SOLDEV</Menu.Item>
              <Menu.Item key="FjHZmPVVUFA3j2VbAEic38aDXPnWT7FMMPqAVo4wfysy">STREAMCATCHER | OTSS/SOLDEV</Menu.Item>
              <Menu.Item key="Buvxrn73iDp9wPSq2p6BEWSvS2DKB2PhXpNuXcoJ7qj3">BLACK SUN | CALGBS/SOLDEV</Menu.Item>
              <Menu.Item key="AuReXhw5rBjoJz3QittiQkvFHrbANzhaNvsJC7gyp222">BLACK SUN | CCHSB/SOLDEV</Menu.Item>
              <Menu.Item key="J96Mddz8WLyM1uXchjwz95R75q4uXd3GrTinLUTza7y9">WHITE HOT | OJSW/SOLDEV</Menu.Item>
              <Menu.Item key="3aZj7xKNAJ2aPXcAWWihskbZp4HPzmXtneJP8LHDG1zF">RAYDIUM DEFY | PX5SR/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="PET">
              <Menu.Item key="3bpj2X2egL7oxj97Tkrdwrc1YDW5oLj8aSJ6kJQ6TPmG">TIGU | TIGU/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="EMOTE">
              <Menu.Item key="6p3yA1yQbaDuqkKP1KCcmPfeok6cTigx3x3fW38z6LsS">ANCIENT DANCE | TIGUEA/SOLDEV</Menu.Item>
              <Menu.Item key="2GvorBCrUSGQVP8LxdJtBbxnJyjreq8raUK5qfA52sAr">PEACE SIGN | CEMOP/SOLDEV</Menu.Item>
              <Menu.Item key="AJyRNECwsV33kdJdfjw3jvnkfVtD7cSezLdWu72BZHnE">SQUIDDISH | VOPESQ/SOLDEV</Menu.Item>
              <Menu.Item key="6GxxCiqH7MqxxeG1hkNjZhz4nk3dBAnBnSByhvtbvaGV">ROLLING COAL | FBPLER/SOLDEV</Menu.Item>
              <Menu.Item key="7DfjaBdgW323oc6UXBdcaykR7UV8Y5kvXTF9JAhDDxR1">TO INFINITY | CALGEI/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="CREW GEAR">
              <Menu.Item key="ETAKJt1Qj2zryF8wZeTDzzYTAPiTfLrvhvcEv7oHYfZd">NOBLE SIGNER | CONSO/SOLDEV</Menu.Item>
              <Menu.Item key="2RYmYfN5aY8vEiWPmx5UxC6Hpv9ExWkZQmACWV5N6u1b">NOBLE CLOAK | CONCC/SOLDEV</Menu.Item>
              <Menu.Item key="FBYVV1cUsQNqMGuvBMGoBJ9f1MkfeioNX2NhFSpJdUqt">REPLICATUR SHAWL | CORUS/SOLDEV</Menu.Item>
              <Menu.Item key="zQgdx4Soo1jYTkEBTRKt6upkUN6ruNYAjT5zYHKsb18">ARMSTRONG PATCH | PCHAUP/SOLDEV</Menu.Item>
              <Menu.Item key="4ya66wcZAa13XZe888TPobFFSXZcEMMpHq4SjqnDv1HP">VINTAGE ASTRONAUT SUIT | COVAS/SOLDEV</Menu.Item>
              <Menu.Item key="42Q7gp1nmgiUaXDXQ3upnMdU21RQt827JhYdEBq1XUme">TTT 300K CRYPTOKICKERS | FM-T3CK/SOLDEV</Menu.Item>
              <Menu.Item key="2JRdL4U7TEhdu2se93e2CVsdJiJmQVs8jC9QdUvqBiAX">TTT 300K PHANTOM | FM-T3PH/SOLDEV</Menu.Item>
              <Menu.Item key="F2fLV1bVTtPJHrWeiPxsqEbRcU13pYdHZxgAwJcxXCWG">COSMIC ORIGIN 92 | FM-CO92/SOLDEV</Menu.Item>
              <Menu.Item key="EECuByXTrQnKgnyH3C4VbpuTRUa2MhnY4qVFFEYedaYV">TTT 300K STEP.FINANCE | FM-T3STEP/SOLDEV</Menu.Item>
              <Menu.Item key="FYSAuQZmPsw6veCz5wdKQHiHEEfskBweW3h7zDAkhMRF">TTT 300K RAYDIUM | FM-T3RAY/SOLDEV</Menu.Item>
              <Menu.Item key="HmXRRV4mPqcEqsPbZQR4ENj7VgJttY4FBLaX1FFPMSnV">PRIMORDIAL GLO | FM-PLG/SOLDEV</Menu.Item>
              <Menu.Item key="6HE1XCqhxaAFvzj9FdGxpZQZv5DBc8RioPAphPaF23CF">TTT 300K SERUM  | FM-T3SR/SOLDEV</Menu.Item>
              <Menu.Item key="Ao9PryqHpBBEiubGsXdxUqPTJ9VqpRzGTkCTD9XUZ8iz">TTT 300K FTX | FM-T3FTX/SOLDEV</Menu.Item>
              <Menu.Item key="AGuRr9rmRgCLr6YxEh5GUssFUbJ3MSh4ojkTpm7ZDVeK">TTT 300K SOLANA  | FM-T3SOL/SOLDEV</Menu.Item>
              <Menu.Item key="HHcAutpUYDcmkiEd7vREmc9QeXjbyJnyAw6sUgxWpP8h">PHOTONIX PROVENANCE | FM-PP/SOLDEV</Menu.Item>
              <Menu.Item key="EmssowFBT4AGKzk6AM1NLhLcopCUg1raTRewuHQ7qgEs">TTT 300K THE_FAB_RIC_ANT  | FM-T3FAB/SOLDEV</Menu.Item>
              <Menu.Item key="4g2b65xqRs5zmucoeyGfnEFp8BeEGJ8M1FEjANSvkDhC">NXT LE]V[EL DS BODYSUIT  | FM-NLDB/SOLDEV</Menu.Item>
              <Menu.Item key="Fz6ePk2F4BsdCCKPzEHBfyEmQC9BJF2hAvxnTSsX4Gvm">TTT 300K ANIMOCA | FM-T3ANI/SOLDEV</Menu.Item>
              <Menu.Item key="T3gLm8aZkN3gYuf1ZwebMxSkSr5aPidxXnaVGefFmff">TTT 300K ATLAS | FM-T3ATL/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="CHARM">
              <Menu.Item key="HzwSky2xEs2noqQXzFNdqSj7dWqcy5hv3TvWyjPFmZmL">VINTAGE ORBITING SATELLITE | CHMVOS/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="POSTER">
              <Menu.Item key="FT4mtGWWRvyPTSvHByC3XKpUc1JZjAgRRNiAh1fxM7Gj">THE CONVERGENCE WAR | TCW/ATLAS</Menu.Item>
              <Menu.Item key="6ZnF2GzkUnGbgrvFJzzViTQEhz9dnQLnMeetUB3uvQ7r">OM PHOTOLI | OMPH/ATLAS</Menu.Item>
              <Menu.Item key="5NkRE8XATUoC1X1TK5nzFQCb1jhhBDBrJiteGEi7sDFN">DISCOVERY OF IRIS | DOI/ATLAS</Menu.Item>
              <Menu.Item key="DzqWkM6t5RjAkux6e2xpEtLEp51tzSjcaPtFqPF2S9eP">AHR VISITS EARTH | AVE/ATLAS</Menu.Item>
              <Menu.Item key="9Dw7K49ioZ5hhMTpVLHyz2oPzmvohNo51JhGaFDr7GYu">THE ASSASSINATION OF PAIZUL | MRDR/ATLAS</Menu.Item>
              <Menu.Item key="5zXNfD4ZJe4ygTHYqwq7bZshoesH8YzkCoCspVEri1mP">THE HEART OF STAR ATLAS | HOSA/ATLAS</Menu.Item>
              <Menu.Item key="Dvu2TsfgJ2AXQV5eV4S5UeeM1VNPx95hA51Putx6N6hY">USTUR WOD.BOD | UWB/ATLAS</Menu.Item>
              <Menu.Item key="6c3UNB3MRrcbtPyxRVyRC7XJnKJJFuy9GKoJcGG92pFb">PAIZUL FUNERAL PROCESSION | PFP/ATLAS</Menu.Item>
              <Menu.Item key="AbraLBj6qdcYnbrTPXX6ofeQyk7zkLJ833SedxgNregM">THE SIGNING OF THE PEACE TREATY | SPT/ATLAS</Menu.Item>
              <Menu.Item key="9QG7CAKMaqUyMKhpmcda3hpFJBATMCuetuj9179jaqzr">THE LAST STAND | TLS/ATLAS</Menu.Item>
              <Menu.Item key="DVXwZF8AgbNXgPCcDGufoDxKpfxGbT167xtWaHgNWkyf">ARMSTRONG FOREVER | ASF/ATLAS</Menu.Item>
              <Menu.Item key="9wnYwcmuvCTfyVbLQJUbaMyyFsve17xQCcjWDUzHvC9D">SHORT STORY OF A LOST ASTRONAUT | LOST/ATLAS</Menu.Item>
              <Menu.Item key="4ih4pyDbTwMEnzD4kbKhs8zWLfUYjNtaRCTcPPrL7BUF">THE PEACEBRINGERS ARCHIVE | PBA/ATLAS</Menu.Item>
              <Menu.Item key="8Enma9JcBu32tdkNRkJLfmT1gtobrWcB2qdZ9oxQPcNF">STAR ATLAS | STAR/ATLAS</Menu.Item>
              <Menu.Item key="6NUofpJFNhc8WSVWHmNJu48CZdrrG3hkKM9P7L3eaKPj">B ❤ P | LOVE/ATLAS</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="HUMAN">
              <Menu.Item key="4VQHTZV3US5FvyXbZB2qB9dYJBrqoB5Mz7VErUqZMWDh">SAMMY BANX | CMHMSB/ATLAS</Menu.Item>
              <Menu.Item key="3CuVH8rxExBa9RegkqHmUC25pSuRwqC3SfMsZAkiQdZH">ANNA TOLLE | CMHFAT/ATLAS</Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
          <Menu.SubMenu title="STRUCTURE">
            <Menu.ItemGroup title="STAKE">
              <Menu.Item key="EGCEL6EU5zDAn39FcNBeikVkWQGQc1Po4XLRjLX1xRnq">CLAIM STAKE TIER 1 | STAKE1/SOLDEV</Menu.Item>
              <Menu.Item key="5vJ46uQCA3t2YjFZ6Py1eQF4xzeFNWaoeAPrB333fKwH">CLAIM STAKE TIER 2 | STAKE2/SOLDEV</Menu.Item>
              <Menu.Item key="BbtbXcqUZ9sEznffTbuYgSuDRgnDT5qE4iu66TDceoDs">CLAIM STAKE TIER 3 | STAKE3/SOLDEV</Menu.Item>
              <Menu.Item key="d1U977MsMwohfBza9dga5Aq4srrBoTQu6WChEU4Z9p3">CLAIM STAKE TIER 4 | STAKE4/SOLDEV</Menu.Item>
              <Menu.Item key="RZMjYFwyUSfSnGeeduLTqKEtz2Hxiec56LUBPsfrE1w">CLAIM STAKE TIER 5 | STAKE5/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="MINING EQUIPMENT">
              <Menu.Item key="7xRcE7oZvfFyXdwGN7cQPpPtTSjhhX7YxpmXnxEoJ7hj">POWER PLANT | MSPP1/SOLDEV</Menu.Item>
              <Menu.Item key="3dmoriYzuVTfhWXuj5Qs1UpNN1H4sovs3aNLcRa9xopG">MINING DRILL | MSD1/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="SPACE STATION STRUCTURE">
              <Menu.Item key="99TT6r7mdSCZN7Q9go6g3fD8AUFRWjhegqVUHCT2kfEx">SPACE STATION | OSTD1/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
          <Menu.SubMenu title="ACCESS" >
            <Menu.ItemGroup title="BADGE">
              <Menu.Item key="6Xsn5KBvaJ4rbpDWEQbw2ddn243j7R6Uuqtg579GxXp6">ATLAS BADGE | BGAT/SOLDEV</Menu.Item>
              <Menu.Item key="BsFHqDwAv1a4vLkhLQBK8FQY2nCDY5bkEb3CeL4V7QbY">PRINCIPAL'S BADGE | BGPR/SOLDEV</Menu.Item>
              <Menu.Item key="FiCKPu8Cp1csJYpy6fXvYGJPADbHNAKuQVzMBEHX2TF8">OFFICER'S BADGE | BGOF/SOLDEV</Menu.Item>
              <Menu.Item key="Gb1maECap5PLX8CZhEnJCrjegQ9zFwzjCi8xNj8HEAL5">SUPERIOR'S BADGE | BGSUP/SOLDEV</Menu.Item>
              <Menu.Item key="EcMH4HQd1a6htVTpnzk8QM4rmqvhW3myQwhUJonpjaDD">CAPTAIN'S BADGE | BGCPN/SOLDEV</Menu.Item>
              <Menu.Item key="8aGCYfCyH4qrVoKhZzoBCrV63uGEmDNPEVmhCg9VszWN">EXECUTIVE BADGE | BGEXE/SOLDEV</Menu.Item>
              <Menu.Item key="J5fQRvYx8fNaghHHDdY9pAZcFhTPo5aJzbsSW2yBeFMQ">UNIQUE BADGE | BGUNQ/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="LICENSE">
              <Menu.Item key="2HVSdEJb5umdrSK4ok9DY9GraUhyWjGRVRRFo1fGRcT8">VIP | VIP/SOLDEV</Menu.Item>
              <Menu.Item key="A6Vxro3D6q4QUFfKjqy6dhARgJE8Ho7stbsjQceQXnUr">FACTION META-PAS | MPAS/SOLDEV</Menu.Item>
              <Menu.Item key="GDLjpemYCDNR4ad9BYd5TmtCQdvGY7FHcQBR552Fq8D8">COUNCIL META-PAS | CMPAS/SOLDEV</Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
          <Menu.SubMenu title="RESOURCE" >
            <Menu.ItemGroup title="CONSUMABLE">
              <Menu.Item key="Fc21VFUUCt85khP1KZKDVCtYtxgsSrxBWzGW8rVj5PMw">FUEL | FUEL/ATLAS</Menu.Item>
              <Menu.Item key="H1GNK3ydoDUGvDP2y8PYeiSGkQYzJfgqC7sBfKAVmrrR">FOOD | FOOD/ATLAS</Menu.Item>
              <Menu.Item key="CBfmbXmXdvZrvPPA2QFzRSrKAdePnM2a81ghUWN1NHZu">TOOLKIT | TOOL/ATLAS</Menu.Item>
              <Menu.Item key="B4BMgDVxW5uzCBuQjy3TVARTNyPJT93vSzhKAhABvqQd">AMMUNITION | AMMO/ATLAS</Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>

          {connected && (!searchFocussed || location.pathname === '/balances') && (
            <Menu.Item key="/balances" style={{ margin: '0 10px' }}>
              BALANCES
            </Menu.Item>
          )}
          {connected && (!searchFocussed || location.pathname === '/orders') && (
            <Menu.Item key="/orders" style={{ margin: '0 10px' }}>
              ORDERS
            </Menu.Item>
          )}


        </Menu>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: 5,
          }}
        >
          <AppSearch
            onFocus={() => setSearchFocussed(true)}
            onBlur={() => setSearchFocussed(false)}
            focussed={searchFocussed}
            width={searchFocussed ? '350px' : '35px'}
          />
        </div>
        <div>
          <Row
            align="middle"
            style={{ paddingLeft: 5, paddingRight: 5 }}
            gutter={16}
          >
            <Col>
              <PlusCircleOutlined
                style={{ color: '#99CCFF' }}
                onClick={() => setAddEndpointVisible(true)}
              />
            </Col>
            <Col>
              <Popover
                content={endpoint}
                placement="bottomRight"
                title="URL"
                trigger="hover"
              >
                <InfoCircleOutlined style={{ color: '#99CCFF' }} />
              </Popover>
            </Col>
            <Col>
              <Select
                onSelect={setEndpoint}
                value={endpoint}
                style={{ marginRight: 8, width: '150px' }}
              >
                {availableEndpoints.map(({ name, endpoint }) => (
                  <Select.Option value={endpoint} key={endpoint}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>
        {connected && (
          <div>
            <Popover
              content={<Settings autoApprove={wallet?.autoApprove} />}
              placement="bottomRight"
              title="Settings"
              trigger="click"
            >
              <Button style={{ marginRight: 8 }}>
                <SettingOutlined />
                Settings
              </Button>
            </Popover>
          </div>
        )}
        <div>
          <WalletConnect />
        </div>
      </Wrapper>
    </>
  );
}
