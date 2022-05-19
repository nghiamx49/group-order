import React from "react"
import {Link} from 'react-router-dom'

const TrademarkOfItem = (props) => {
  const{trademark} = props
  return(
         <Link key={trademark._id} to={`/product?trademarkId=${trademark._id}`} className="group">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={trademark.image}
                  alt={trademark.imageAlt}
                  className="w-full h-full object-center object-cover group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{trademark.trademarkName}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{trademark.description}</p>
          </Link>
  )
}

export default TrademarkOfItem


