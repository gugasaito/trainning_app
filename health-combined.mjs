import {sessionHealthWorkouts} from './health-model.mjs';
export function combinedHealth(session){
 const parts=sessionHealthWorkouts(session);if(!parts.length)return null;if(parts.length===1)return parts[0];
 const known=parts.filter(h=>h.activeCaloriesKcal!==null),points=[...new Map(parts.flatMap(h=>h.heartRateTimeline?.points??[]).sort((a,b)=>a.at-b.at).map(p=>[p.at,p])).values()];
 const minimum=parts.map(h=>h.heartRateMinBpm).filter(n=>n!==null),maximum=parts.map(h=>h.heartRateMaxBpm).filter(n=>n!==null);
 const types=[...new Set(parts.map(h=>h.activityType))];
 return {...parts[0],parts,activityType:types.length===1?types[0]:'Atividades combinadas',source:[...new Set(parts.map(h=>h.source))].join(' · '),startedAt:Math.min(...parts.map(h=>h.startedAt)),endedAt:Math.max(...parts.map(h=>h.endedAt)),updatedAt:Math.max(...parts.map(h=>h.updatedAt)),activeCaloriesKcal:known.length?known.reduce((sum,h)=>sum+h.activeCaloriesKcal,0):null,caloriesKnown:known.length,duration:parts.reduce((n,h)=>n+h.endedAt-h.startedAt,0),heartRateAverageBpm:points.length?points.reduce((n,p)=>n+p.bpm,0)/points.length:null,heartRateMinBpm:minimum.length?Math.min(...minimum):null,heartRateMaxBpm:maximum.length?Math.max(...maximum):null,...(parts.some(h=>h.heartRateTimeline!==undefined)?{heartRateTimeline:{points,reduced:parts.some(h=>h.heartRateTimeline?.reduced)}}:{})};
}
