import { AuthorDetail } from "@/components/authors/AuthorDetail";
import { NextPage } from "next";

const AuthorDetailPage: NextPage = () => {
    return (
         <AuthorDetail
          name="Michail Bulgakov"
          biography="Ruský spisovateľ a dramatik, jeden z najvýznamnejších autorov sovietskeho obdobia. Jeho diela často obsahovali satirické prvky a kritiku totalitného režimu. Najznámejšie dielo Majster a Margaréta bolo publikované až po jeho smrti a stalo sa kultovým románom 20. storočia."
          birthYear={1891}
          deathYear={1940}
          nationality="Rusko"
          totalBooks={12}
          availableBooks={8}
          mostPopularBook="Majster a Margaréta"
          genres={["Satira", "Fantasy", "Drama", "Klasická literatúra"]}
          awards={[
            "Cena Moskevského Art Theatre (1926)",
            "Posmrtné uznanie UNESCO (1991)"
          ]}
          avatarColor="bg-gradient-to-br from-purple-600 to-pink-600"
        />
    )
}

export default AuthorDetailPage