
wu.registerComponent('pricebox', (item) => {return `
<div class="bg-white rounded-lg shadow-lg overflow-hidden mt-8 max-w-sm mx-auto border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between mb-2">
        <div class="flex flex-col items-center">
            <span class="text-lg font-bold text-gray-800" title="Dallas Fort Worth">DFW</span>
        </div>
        <div class="flex-1 border-t-2 border-dashed border-gray-300 mx-4 relative top-1"></div>
        <div class="flex flex-col items-center">
            <span class="text-lg font-bold text-blue-600" title="John F Kennedy">JFK</span>
        </div>
      </div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">No Stops</div>
    </div>
    <div class="p-6">
        <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Fare Details</span>
            <div class="flex-grow border-t border-gray-300"></div>
        </div>
        
        <div class="flex justify-center space-x-4 mt-2 mb-4">
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                2 Adults
            </span>
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                1 Child
            </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="text-center">
                <div class="text-xs text-gray-500 uppercase">Departure</div>
                <h3 class="text-xl font-bold text-gray-800">23:40 PM</h3>
            </div>
            <div class="text-center">
                <div class="text-xs text-gray-500 uppercase">Arrival</div>
                <h3 class="text-xl font-bold text-gray-800">02:30 AM</h3>
            </div>
        </div>
        
        <div class="mt-4 space-y-2">
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Adult Fare:</span>
                <span class="font-medium bg-gray-100 px-2 py-1 rounded">${item.adultFare} USD</span>
            </div>
            <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Child Fare:</span>
                <span class="font-medium bg-gray-100 px-2 py-1 rounded">${item.childFare} USD</span>
            </div>
        </div>
    </div>
    
    <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center">
                <div class="text-xs text-gray-500 uppercase">Tax (8%)</div>
                <h5 class="text-lg font-semibold text-gray-700">$${((item.adultFare + item.childFare)*0.08).toFixed(2)}</h5>
            </div>
            <div class="text-center">
                <div class="text-xs text-gray-500 uppercase text-blue-600">Total</div>
                <h5 class="text-xl font-bold text-blue-600">$${(item.adultFare + item.childFare + ((item.adultFare + item.childFare)*0.08)).toFixed(2)}</h5>
            </div>
        </div>        
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200 shadow-md transform hover:-translate-y-0.5">Buy Now</button>
    </div>
</div>`            
});
    