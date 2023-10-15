import { Loader2 } from "lucide-react";

export type LoadingScreenProps = {
  title?: string;
}

function LoadingScreen({ title }: LoadingScreenProps) {
  return (
    <div className='w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center flex-col items-center'>
      <h1 className='font-semibold'>{title || ''}</h1>
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  )
}

export default LoadingScreen