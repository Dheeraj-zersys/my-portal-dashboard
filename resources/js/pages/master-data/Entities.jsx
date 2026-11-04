import AppLayout from "@/layouts/AppLayout";
import EntityManager from "@/components/MasterData/Entities";

export default function Entities({ managers, filters, options }) {
    return (
        <EntityManager
            managers={managers}
            filters={filters}
            options={options}
            showSearch
        />
    );
}

Entities.layout = AppLayout;
