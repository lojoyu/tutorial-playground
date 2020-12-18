import {EnvelopeNode} from './envelop';
//import {Keyboard} from './keyboard';
import * as Synth from './soundusage';
import $ from 'jquery';
import { connectServer } from './socket';

initWebaudio();
initSound();
let soundcount = 0;
let context;
let filter, gain, compressor;
let keyboard;

function initWebaudio() {
    try {
        // Fix up for prefixing
        //window.AudioContext = window.AudioContext||window.webkitAudioContext;
        //window.AudioContext.prototype.createEnvelope = createEnvelope;
        //context = new AudioContext();
        context = Synth.initContext();
        //AudioNode.
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
        console.log(e);
        return false;
    }
    //initSound();
    return true;
}

function initSound() {
    //console.log('init sound');
    //keyboard = new Keyboard($('body'), 'C4', 3-6/12);

    
    filter = Synth.newFilter(440);
    //oscillator.connect(filter);
    gain = Synth.newGain(1);
    compressor = Synth.newCompressor();
    // oscillator.connect(envelope.input);
    
    filter.connect(gain);
    
    gain.connect(compressor);
    compressor.connect(context.destination);

    $('#startButton').on('click', function() {
        connectServer($('#name').val());
        newSound(220+Math.random()*400);
        $('#start').hide();
    })
    
}

export function newSound(freq) {
    if (soundcount > 10) return;
    let oscillator = Synth.newOsc('square', freq);
    let envelope = new EnvelopeNode(context);
    oscillator.connect(envelope.input);
    oscillator.start();
    envelope.triggerStart();
    envelope.connect(filter);
    soundcount++;
    setTimeout(()=>{
        envelope.triggerEnd();
        setTimeout(()=>{
            //console.log('disconnect');
            envelope.disconnect(filter);
        }, envelope.releaseTime*1000);
        soundcount --;
    }, 1000);
}

function changeArp(arp) {
    //keyboard.arpChange(arp);
}

// $('#wave-type').change(function() {
//     console.log($("#wave-type option:selected").attr('id'));
//     oscillator.type = $("#wave-type option:selected").attr('id');
// })

// $('#filter-frequency').change(function() {
//     console.log($('#filter-frequency').val());
//     filter.frequency.setValueAtTime($('#filter-frequency').val(), context.currentTime);
//     console.log(filter.frequency.value);
// })

// $('#piano button').mousedown(function() {
//     console.log(parseInt($(this).text()));
//     oscillator.frequency.setValueAtTime(parseInt($(this).text()),context.currentTime);
//     envelope.triggerStart();
// })

// $('#piano button').mouseup(function() {
//     //oscillator.frequency.setValue($(this).text());
//     envelope.triggerEnd();
// })

// $('.envelope').change(function() {
//     eval(`envelope.${$(this).attr('id')}=${$(this).val()}`);
// })




function triggerPlay() {
    envelope.triggerStart();
}

function triggerStop() {
    envelope.triggerEnd();
}

function scalingValue(fromRange, toRange, value) {
    return (value - fromRange[0])*(toRange[1]-toRange[0])/(fromRange[1]-fromRange[0])+ toRange[0];
}

function setValue(obj, value, time) {
    obj.setValueAtTime(value, time);
}

export function changeFilter(param) {
    //console.log(filterFreq);
    //filter.frequency.setValueAtTime(filterFreq, context.currentTime);
    //filter.frequency.value = filterFreq;
    filter.frequency.linearRampToValueAtTime(param[0], context.currentTime+0.02);
    //console.log(Q);
    filter.Q.linearRampToValueAtTime(param[1], context.currentTime+0.02);
    //console.log(filter.frequency);
}

function changeAmp(amp) {
    gain.gain.linearRampToValueAtTime(amp, context.currentTime+0.01);
}

function changePitch(p) {
    keyboard.set('oscillator.detune', p);
}
