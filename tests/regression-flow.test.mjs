import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Accounts,blank,checked} from '../accounts.mjs';
import {transition} from '../session.mjs';
import {attachHealth,automaticCandidate} from '../health-model.mjs';
const exercises=JSON.parse(fs.readFileSync(new URL('../seed.json',import.meta.url))).exercises;
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
function fixture(){let s=transition(null,'start','C',1,1000000);s=transition(s,'finish',null,null,1215000);return {...blank(),sessions:[s],records:[{exercise:exercises.find(e=>e.day==='C').id,week:1,sessionId:s.id,sets:[{value:10,reps:5}],note:'fictício',date:'2026-11-18'}],healthSettings:{enabled:true,autoSync:true,consentAt:'2026-11-18T15:00:00Z'}};}
const summary={provider:'apple-health',workoutId:'synthetic-watch-001',activityType:'Musculação tradicional',source:'Relógio fictício',startedAt:1000000,endedAt:1215000,updatedAt:1300000,activeCaloriesKcal:14.5,heartRateAverageBpm:101.8,heartRateMinBpm:99,heartRateMaxBpm:107};
test('C series survives reopen, summary attachment, backup, and recovery on another storage',()=>{
 const store=memory(),a=new Accounts(store,exercises);a.open('athlete');a.reconcile(null);a.edit(fixture());a.lock();a.open('athlete');assert.equal(a.data().records[0].sets[0].value,10);
 const before=a.data(),linked=attachHealth(before,before.sessions[0].id,summary);assert.deepEqual(linked.records,before.records);a.edit(linked);
 const exported=JSON.stringify(a.data()),restored=checked(JSON.parse(exported),exercises);assert.deepEqual(restored,linked);
 // Snapshot transport is simulated here; no Firebase service or real account is contacted.
 const remote={state:restored,sessions:restored.sessions,revision:1};a.ack('athlete',a.env.serial,1);
 const otherDevice=new Accounts(memory(),exercises);otherDevice.open('athlete');otherDevice.reconcile(remote);assert.deepEqual(otherDevice.data(),linked);assert.equal(otherDevice.env.dirty,false);
 otherDevice.open('other');assert.deepEqual(otherDevice.data(),blank());assert.equal(otherDevice.data().healthSettings,undefined);otherDevice.open('athlete');assert.deepEqual(otherDevice.data(),linked);
});
test('local edits remain recoverable while offline, then acknowledgement clears pending state',()=>{
 const store=memory(),a=new Accounts(store,exercises);a.open('athlete');a.reconcile(null);a.edit(fixture());const reopened=new Accounts(store,exercises);reopened.open('athlete');assert.equal(reopened.env.dirty,true);assert.deepEqual(reopened.data(),a.data());reopened.ack('athlete',reopened.env.serial,1);assert.equal(reopened.env.dirty,false);
});
test('delayed Health result can match on subsequent query without duplicate summaries',()=>{
 const d=fixture(),s=d.sessions[0];assert.equal(automaticCandidate(d,s,[]),null);assert.equal(automaticCandidate(d,s,[summary]).workoutId,summary.workoutId);const linked=attachHealth(d,s.id,summary),again=attachHealth(linked,s.id,summary);assert.deepEqual(again,linked);assert.equal(again.sessions.length,1);
});
test('ambiguous results and distant workouts never auto-associate',()=>{
 const d=fixture(),s=d.sessions[0];assert.equal(automaticCandidate(d,s,[summary,{...summary,workoutId:'another'}]),null);assert.equal(automaticCandidate(d,s,[{...summary,startedAt:2000000,endedAt:2215000}]),null);
});
