type Pickable<T extends Exclude<any, []>> = (T|Pickable<T>)[];
type Pickcallable<T> = Pickable<()=>T>;

function pick<T>(candidates:Pickable<T>):T{
  const slot = candidates[Math.floor(Math.random() * candidates.length)]!;
  if(Array.isArray(slot)) return pick<T>(slot);
  return slot as T;
}


const givenName = [
  ()=>{ // Japanese male names
    const prefix   = [
      '太', ['一', '二','三','四','五','六','七','八','九','十'],
      '祟', '高', '海','山','耕','新'
    ];
    const suffixes = [
      '太', '郎',['太郎','次郎','三郎','史郎'], '之','彦','造','麿',
      ['之助','之介','助','介']
    ];
    return pick<string>(prefix) + pick<string>(suffixes);
  }
];

for(let i=0;i<10;i++) console.log(pick<()=>string>(givenName)());
