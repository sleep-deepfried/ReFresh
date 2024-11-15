import { IoIosAddCircle, IoIosRemoveCircle} from "react-icons/io";

function AddRemoveCard(){
    return(
        <div className="p-5">
            <div className="rounded-xl bg-[#e0e0e0] shadow-[6px_6px_6px_#9f9f9f,-6px_-6px_6px_#ffffff] p-4 space-y-3">
                <div>
                    <p>Hello, <span className="font-semibold">Vince!</span></p>
                    <p className="text-orange">Complete your Daily Nutrition</p>
                </div>
                <div className="flex text-orange justify-around">
                    <button className="flex items-center bg-[#E6CDB6] rounded-xl space-x-1 min-w-32 justify-center py-2 font-semibold">
                        <IoIosAddCircle/>
                        <p>Add</p>
                    </button>
                    <button className="flex items-center bg-[#E6CDB6] rounded-xl space-x-1 min-w-32 justify-center py-2 font-semibold">
                        <IoIosRemoveCircle />
                        <p>Remove</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRemoveCard