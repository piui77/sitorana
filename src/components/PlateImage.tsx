import { useEffect, useState, type CSSProperties } from "react";
import { getPhoto } from "../lib/photos";
import { portraitSrc, type PortraitSpec } from "../lib/portraits";

interface Props {
  sp: PortraitSpec & { name: string };
  className?: string;
  style?: CSSProperties;
}

/**
 * Immagine della specie: usa la foto reale scaricata in `public/images/specie/`
 * (registrata nel manifest generato da download_foto.py). Se la foto non è
 * ancora stata scaricata — o se il file manca/corrotto — mostra la tavola
 * illustrata SVG incorporata nel sito. Nessuna risorsa esterna, mai.
 */
export default function PlateImage({ sp, className, style }: Props) {
  // undefined = in attesa del manifest · null = nessuna foto locale · string = percorso
  const [photo, setPhoto] = useState<string | null | undefined>(undefined);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let attivo = true;
    getPhoto(sp.latin).then((src) => {
      if (attivo) setPhoto(src);
    });
    return () => {
      attivo = false;
    };
  }, [sp.latin]);

  const mostraFoto = typeof photo === "string" && !broken;

  return mostraFoto ? (
    <img
      src={photo}
      alt={`Foto di ${sp.name} (${sp.latin})`}
      loading="lazy"
      onError={() => setBroken(true)}
      className={className}
      style={style}
    />
  ) : (
    <img
      src={portraitSrc(sp)}
      alt={`Tavola illustrata di ${sp.name} (${sp.latin})`}
      loading="lazy"
      className={className}
      style={style}
    />
  );
}
