import { MdErrorOutline } from "react-icons/md";

const ErrorMessage = ({ error }) =>{
    return error ? (
        <p className="text-danger py-2 flex justify-start items-center gap-2">
            <span><MdErrorOutline /></span> {error}
        </p>
    ) : null;
}

export default ErrorMessage;
