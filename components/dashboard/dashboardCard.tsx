export const Card = ({ children, className = "", hover = true }:{children:React.ReactNode,className:string, hover?:boolean}) => {
    
    return(
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
    {children}
  </div>
);
}