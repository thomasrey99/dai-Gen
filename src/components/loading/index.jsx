import { Spinner } from "@heroui/react";

const Loading = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-slate-900/60">
            <Spinner color="primary" label="Cargando datos" labelColor="primary" />
        </div>
    );
};

export default Loading;
