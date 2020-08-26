import { useRouter } from 'next/router';

export default function Details(props) {
    const router = useRouter();
    const { id } = router.query;

    return (<div onClick={()=> router.back()}>{id}</div>);
}