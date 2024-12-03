import Image from "next/image";

function Splash() {
    return (
        <div className="fixed inset-0 z-50 min-h-screen bg-[url('/assets/splash.svg')] bg-cover bg-center flex items-center justify-center pb-20">
            <div className="flex flex-col items-center space-y-4">
                <Image 
                    src="/assets/splash-logo.svg" 
                    alt="logo" 
                    width={157} 
                    height={45} 
                    priority 
                    className="animate-fade-in"
                />
                <Image 
                    src="/assets/splash-text.svg" 
                    alt="logo text" 
                    width={255} 
                    height={45} 
                    priority 
                    className="animate-fade-in delay-300"
                />
            </div>
        </div>
    );
}

export default Splash;