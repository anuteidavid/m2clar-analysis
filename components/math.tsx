"use client";
import katex from "katex";
import { Fragment, useMemo } from "react";
export function MathText({text}:{text:string}) {
 const parts=useMemo(()=>text.split(/\$([^$]+)\$/g),[text]);
 return <>{parts.map((part,i)=>i%2===0?<Fragment key={i}>{part}</Fragment>:<span key={i} dangerouslySetInnerHTML={{__html:katex.renderToString(part,{throwOnError:false,displayMode:false})}}/>)}</>;
}
