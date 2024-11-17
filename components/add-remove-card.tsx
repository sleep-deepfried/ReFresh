import { IoIosAddCircle, IoIosRemoveCircle} from "react-icons/io";

function AddRemoveCard(){
    return(
        <div className="p-5">
            <div className="rounded-xl bg-[#e0e0e0] shadow-[3px_3px_3px#9f9f9f,-3px_-3px_3px#ffffff] p-4 space-y-3">
                <div className="">
                    <p>Hello, <span className="font-semibold">Vince!</span></p>
                    <p className="text-orange font-semibold text-xl">Complete your Daily Nutrition</p>
                </div>
                <div className="flex text-orange justify-around font-bold text-lg">
                    <button className="flex items-center bg-[#E6CDB6] rounded-xl space-x-1 min-w-32 justify-center py-2">
                        <IoIosAddCircle/>
                        <p>Add</p>
                    </button>
                    <button className="flex items-center bg-[#E6CDB6] rounded-xl space-x-1 min-w-32 justify-center py-2">
                        <IoIosRemoveCircle />
                        <p>Remove</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRemoveCard