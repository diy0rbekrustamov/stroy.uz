import React from 'react'
const paths={
 arrow:<><path d="M4 12h16M13 5l7 7-7 7"/></>,
 arrowUp:<><path d="M7 17 17 7M8 7h9v9"/></>,
 chevron:<><path d="m9 18 6-6-6-6"/></>,
 down:<><path d="m6 9 6 6 6-6"/></>,
 x:<><path d="M18 6 6 18M6 6l12 12"/></>,
 menu:<><path d="M3 7h18M3 12h18M3 17h18"/></>,
 search:<><circle cx="10.8" cy="10.8" r="6.9"/><path d="m16 16 5 5"/></>,
 heart:<><path d="M20.8 9.3c0 5.2-8.8 10.2-8.8 10.2S3.2 14.5 3.2 9.3a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"/></>,
 bag:<><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
 user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
 layers:<><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/></>,
 boxes:<><path d="m4 7 5-3 5 3v6l-5 3-5-3V7Z"/><path d="m4 7 5 3 5-3M9 10v6M14 13l5-3 3 2v6l-5 3-3-2v-6ZM14 13l4 3 4-4M18 16v5"/></>,
 hardhat:<><path d="M3 18h18v3H3zM5 18v-4a7 7 0 0 1 14 0v4M12 7v8M8 8v4M16 8v4"/></>,
 wrench:<><path d="M20 7.1a5 5 0 0 1-6.7 5.7l-7.7 7.6a2.1 2.1 0 0 1-3-3l7.8-7.7A5 5 0 0 1 16.1 3l-3.2 3.2 4 4L20 7.1Z"/></>,
 paintbrush:<><path d="m14 4 6 6-9.5 9.5-6-6L14 4ZM12 6l6 6M4.5 16.3C2.9 17.3 3 20 2 22c2.5-.4 4.8-.2 6.2-2.2"/></>,
 zap:<><path d="m13 2-9 11h7l-1 9 10-12h-7l0-8Z"/></>,
 check:<><path d="m5 12 4 4L19 6"/></>,
 minus:<><path d="M5 12h14"/></>,
 plus:<><path d="M5 12h14M12 5v14"/></>,
 truck:<><path d="M2 6h12v11H2zM14 10h4l4 4v3h-8z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
 shield:<><path d="m12 2 9 4v6c0 6-3.8 9-9 10-5.2-1-9-4-9-10V6l9-4Z"/><path d="m8 12 3 3 5-6"/></>,
 package:<><path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10M8 5l9 5"/></>,
 star:<><path d="m12 2 2.9 6.9 7.1.6-5.5 4.8 1.8 7-6.3-3.8-6.3 3.8 1.8-7L2 9.5l7.1-.6L12 2Z"/></>,
 location:<><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 filter:<><path d="M4 7h16M7 12h10M10 17h4"/></>,
 instagram:<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></>,
 send:<><path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/></>,
 rotate:<><path d="M20 11a8 8 0 0 0-14-5L3 9M3 4v5h5M4 13a8 8 0 0 0 14 5l3-3M21 20v-5h-5"/></>,
 cube:<><path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10"/></>,
 trash:<><path d="M4 7h16M10 3h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>
}
export default function Icon({name,size=20,strokeWidth=1.7,className='',...rest}){
 return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>{paths[name]||paths.cube}</svg>
}
