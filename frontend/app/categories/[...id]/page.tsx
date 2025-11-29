import { CategoryDetail } from "@/components/categories/CategoryDetail";
import { NextPage } from "next";

const CategoryDetailPage: NextPage = () => {
    return (
        <CategoryDetail
            name="Svetová literatúra"
            description="Objavte najvýznamnejšie diela svetovej literatúry od klasických autorov až po súčasných spisovateľov. Táto kategória obsahuje romány, poviedky a eseje, ktoré formovali literatúru a ovplyvnili generácie čitateľov."
            icon="📚"
            totalBooks={156}
            availableBooks={89}
            popularBooks={24}
            newBooks={12}
            mostBorrowedGenre="Klasická próza"
        />
    )
}

export default CategoryDetailPage