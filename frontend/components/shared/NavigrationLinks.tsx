import Link from "next/link";

const NavigationLinks: React.FC = () => {

    return (
        <>
            <li className="text-black text-xl">
                <Link href="/">Domov</Link>
            </li>
            <li className="text-black text-xl">
                <Link href="/books/all">Knihy</Link>
            </li>
            <li className="text-black text-xl">
                <Link href="/authors/all">Autori</Link>
            </li>
            <li className="text-black text-xl">
                <Link href="/category/all">Kategórie</Link>
            </li>

            <>
                <li className="text-black text-xl">
                    <Link href="/student/login">Žiak</Link>
                </li>

                <li className="text-black text-xl">
                    <Link href="/teacher/login">Učiteľ</Link>
                </li>
            </>
        </>
    );
};

export default NavigationLinks;