import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";
import { toUtf8String } from "@ethersproject/strings";
import { useQuery } from "@/src/hooks/useQuery";
import { useIpfs } from "@/src/context/Ipfs";

const getQuery = () => {
  return `
  {
    covers {
      id
      key
      ipfsHash
      ipfsBytes
      stopped
    }
  }
`;
};

export const useFetchCovers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { data: ipfs, getIpfsByHash } = useIpfs();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    function exec() {
      if (!graphData || !networkId) return;

      const _covers = graphData.covers || [];
      const _data = _covers.map((_cover) => {
        let ipfsData = _cover.ipfsData || ipfs[_cover.ipfsHash];

        try {
          ipfsData = JSON.parse(toUtf8String(_cover.ipfsBytes));
        } catch (err) {
          console.log("Could not parse ipfs bytes", _cover.key);
        }

        // Fetch IPFS data if does not exist
        if (!ipfsData) {
          getIpfsByHash(_cover.ipfsHash);
          return null;
        }

        return {
          key: _cover.key,
          projectName: ipfsData.projectName,
          coverName: ipfsData.coverName,
          resolutionSources: ipfsData.resolutionSources,
          about: ipfsData.about,
          tags: ipfsData.tags,
          rules: ipfsData.rules,
          links: ipfsData.links,

          ipfsData: ipfsData,
        };
      });

      if (ignore) return;
      setData(_data.filter((x) => !!x));
    }

    exec();

    return () => {
      ignore = true;
    };
  }, [getIpfsByHash, graphData, ipfs, networkId]);

  useEffect(() => {
    let ignore = false;

    setLoading(true);

    refetch(getQuery())
      .catch(console.error)
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [refetch]);

  const getInfoByKey = (coverKey) => {
    return data.find((x) => x.key === coverKey) || {};
  };

  return {
    data,
    getInfoByKey,
    loading,
  };
};
