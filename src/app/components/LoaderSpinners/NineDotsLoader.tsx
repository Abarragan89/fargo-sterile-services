import dynamic from "next/dynamic";

const GridLoader = dynamic(() => import("react-spinners/GridLoader"), { ssr: false });

export default function NineDotsLoader() {
    return (
            <GridLoader size={25} color="rgb(212, 70, 55)" />
    );
}