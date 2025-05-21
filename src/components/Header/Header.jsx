import React from 'react';
export const Header = ({onClickView, onClickAdd})=>{
    return (
    <div className="sticky w-screen top-0 bg-blue-700 text-white flex mb-2 p-2 justify-between">
        <div className="font-bold text-2xl"><span className='text-black'>GoogleCalendar</span> <span className='text-amber-50'>EventManager</span></div>
        <div className="text-white flex lg:w-1/4 gap-5">
            <button className='rounded-md bg-blue-950 p-1.5 ring-2 outline outline-black hover:bg-blue-900 cursor-pointer'onClick={onClickAdd}>Add Events</button>
            <button className='rounded-md bg-black p-1.5 outline outline-amber-500 ring-2 hover:bg-gray-700 cursor-pointer' onClick={onClickView}>View Events</button>
        </div>
    </div>
    );
}
