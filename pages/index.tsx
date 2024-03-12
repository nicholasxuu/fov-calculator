import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { Select, Form, Slider } from 'antd';
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css';
import Checkbox from 'antd/lib/checkbox/Checkbox';

const { Option } = Select;

const MONITOR_COLOR = '#f00';
const MONITOR_THICKNESS = 5;
const FOV_COLOR = '#d77';
const HEAD_SIZE = 6;
const CAR_LENGTH = 495; // centimetres, used to calculate scale for monitors
const BACKGROUND_COLOR = '#9dbbcc';
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 490;
const xOffset = 0;

let headPositions = {
  normX: 0.55, // normalized value, 0-1
  normTY: 0.35,
  normSY: 0.17,
  x: 0,
  ty: 0,
  sy: 0,
};
let carScale = 1;

const getImage = (src: string) => new Promise<HTMLImageElement>((resolve) => {
  const topImage = new Image()
  topImage.src = src;
  topImage.onload = () => {
    resolve(topImage)
  }
})

const loadImage = async (ctx: CanvasRenderingContext2D) => {
  console.log('load images')
  ctx.globalAlpha = 0.5;

  const topImage = await getImage("assets/images/bentley-top.svg")
  const sideImage = await getImage("assets/images/bentley-side.svg")
  ctx.drawImage(topImage, 0, 0);
  ctx.drawImage(sideImage, 0, topImage.height + 10);

  console.log(topImage.height, topImage.width)
  headPositions.x = topImage.width * headPositions.normX;
  headPositions.ty = topImage.height * headPositions.normTY;
  headPositions.sy = sideImage.height * headPositions.normSY + topImage.height + 10;
  carScale = topImage.width / CAR_LENGTH
  console.log('load images complete')
}

const drawHeads = (ctx: CanvasRenderingContext2D) => {
  console.log("draw heads");
  ctx.globalAlpha = 1;
  ctx.fillStyle = MONITOR_COLOR;

  var pi2 = Math.PI * 2;
  var headX = headPositions.x + xOffset;
  var headTY = headPositions.ty;
  var headSY = headPositions.sy;

  ctx.beginPath();
  ctx.arc(headX, headTY, HEAD_SIZE, 0, pi2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX, headSY, HEAD_SIZE, 0, pi2);
  ctx.fill();

  ctx.save();
}

const drawVerticalArc = (
  ctx: CanvasRenderingContext2D,
  x: number,
  fromY: number,
  toY: number,
  radius: number,
) => {
  // ctx.beginPath();
  // ctx.arc(x, fromY, 1, -1, 1, false);
  // ctx.stroke();
  // ctx.beginPath();
  // ctx.arc(x, toY, 1, -1, 1, false);
  // ctx.stroke();

  ctx.beginPath();
  const yLen = (toY - fromY) / 2;
  const angle = Math.asin(yLen / radius);
  const cosX = radius * Math.cos(angle);
  const centerX = x + cosX;
  const centerY = fromY + yLen;
  ctx.arc(centerX, centerY, radius, Math.PI - angle, Math.PI + angle, false);

  ctx.stroke();
}

const drawLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  fromY: number,
  toY: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x, fromY);
  ctx.lineTo(x, toY);
  ctx.stroke();
}

const drawAngle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  textOffsetX: number,
  textOffsetY: number,
) => {
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(fromX, fromY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  if (fromX === toX) {
    const yDiff = Math.abs(fromY - toY)
    const radius = Math.sqrt((fromX - centerX) ** 2 + (fromY - centerY) ** 2)
    const angle = Math.abs(Math.asin(yDiff / 2 / radius));
    const angleNum = Math.round(angle / Math.PI * 180 * 2);
    console.log(angleNum)
    const textSize = 10;
    ctx.fillText(`${angleNum}\u00b0`, centerX + textOffsetX, centerY + textOffsetY + textSize / 2)
  }
}

const drawMonitors = (
  ctx: CanvasRenderingContext2D,
  distanceToScreen: number,
  screenSize: number, // inch
  aspectRatio: number,
  curveRadius: number, // cm
  tripleMonitorAngle: number,
  isTripleMonitor: boolean,
) => {
  console.log("draw monitors");
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = MONITOR_COLOR;

  var headX = headPositions.x + xOffset;
  var headTY = headPositions.ty;
  var headSY = headPositions.sy;

  var monX = headX - distanceToScreen * carScale;
  const monitorInfo = getMonitor(screenSize, aspectRatio, curveRadius)
  console.log("monitorInfo", monitorInfo);
  var monTY = headTY - monitorInfo.w / 2;
  var monSY = headSY - monitorInfo.h / 2;
  var tripleAngle = tripleMonitorAngle;

  var monLeftY = headTY + monitorInfo.w / 2;
  var monRightY = headTY - monitorInfo.w / 2;

  // side view, center monitor front
  ctx.lineWidth = MONITOR_THICKNESS;
  drawLine(ctx, monX, monSY, monSY + monitorInfo.h);
  drawAngle(ctx, headX, headSY, monX, monSY, monX, monSY + monitorInfo.h, -30, 0);


  // top view, center monitor
  ctx.lineWidth = MONITOR_THICKNESS;
  if (curveRadius <= 0) {
    drawLine(ctx, monX, monTY, monTY + monitorInfo.w);
  } else {
    drawVerticalArc(ctx, monX, monTY, monTY + monitorInfo.w, curveRadius * carScale);
  }
  drawAngle(ctx, headX, headTY, monX, monTY, monX, monTY + monitorInfo.w, -30, 0);

  if (isTripleMonitor) {
    // top view, left monitor
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(monX + MONITOR_THICKNESS / 2, monLeftY);
    ctx.rotate((-tripleAngle * Math.PI) / 180);
    ctx.translate(-monX - MONITOR_THICKNESS / 2, -monLeftY);
    ctx.lineWidth = MONITOR_THICKNESS;

    if (curveRadius <= 0) {
      drawLine(ctx, monX, monLeftY, monLeftY + monitorInfo.w);
    } else {
      drawVerticalArc(ctx, monX, monLeftY, monLeftY + monitorInfo.w, curveRadius * carScale);
    }

    // top view, right monitor
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(monX + MONITOR_THICKNESS / 2, monRightY);
    ctx.rotate(((tripleAngle) * Math.PI) / 180);
    ctx.translate(-monX - MONITOR_THICKNESS / 2, -monRightY);
    ctx.lineWidth = MONITOR_THICKNESS;

    if (curveRadius <= 0) {
      drawLine(ctx, monX, monRightY - monitorInfo.w, monRightY);
    } else {
      drawVerticalArc(ctx, monX, monRightY - monitorInfo.w, monRightY, curveRadius * carScale);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const sinX = monitorInfo.w * Math.sin(tripleAngle * Math.PI / 180)
    const cosY = monitorInfo.w * Math.cos(tripleAngle * Math.PI / 180)
    drawAngle(ctx, headX, headTY, monX + sinX, monTY - cosY, monX + sinX, monTY + monitorInfo.w + cosY, 10, 0);
  }
}

const getMonitor = (screenSize: number, aspectRatio: number, curveRadius: number): any => {
  const realWidth = (2.54 * screenSize) * (aspectRatio / Math.sqrt(1 + aspectRatio * aspectRatio))
  const realHeight = 2.54 * screenSize / aspectRatio
  const width = carScale * realWidth
  const height = carScale * realHeight

  const mon = {
    thickness: MONITOR_THICKNESS,
    h: 0,
    w: 0,
    curveAngle: 0,
  }
  if (curveRadius <= 0) {
    mon.h = height
    mon.w = width
  } else {
    mon.h = height
    console.log('real width', realWidth)
    const angle = realWidth / (curveRadius * 2 * Math.PI) * 360 / 180 * Math.PI
    console.log("angle", angle)
    const boxDepth = curveRadius - curveRadius * Math.cos(angle / 2)
    const boxWidth = curveRadius * Math.sin(angle / 2) * 2
    mon.thickness = boxDepth * carScale
    mon.w = boxWidth * carScale
    mon.curveAngle = angle
  }
  return mon
}


const Home: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)

  const [distanceToScreen, setDistanceToScreen] = useState(70);
  const [screenSize, setScreenSize] = useState(32);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [curvature, setCurvature] = useState(80)
  const [isTripleMonitor, setIsTripleMonitor] = useState(true)
  const [tripleMonitorAngle, setTripleMonitorAngle] = useState(60);

  useEffect(() => {
  }, [])

  useEffect(() => {
    const drawCanvas = async () => {
      const ctx = canvas.current?.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      await loadImage(ctx)
      drawHeads(ctx)
      drawMonitors(
        ctx,
        distanceToScreen,
        screenSize,
        aspectRatio,
        curvature,
        tripleMonitorAngle,
        isTripleMonitor,
      )
    }
    drawCanvas();

  }, [
    distanceToScreen,
    screenSize,
    aspectRatio,
    curvature,
    isTripleMonitor,
    tripleMonitorAngle,
  ])



  return (
    <div className={styles.container}>
      <Head>
        <title>fov calculator</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="main">
          <h1>Field of view calculator</h1>
          <p>
            A super simple way to calculate the mathematically accurate field of
            view (FoV) for your racing simulator, based on <em>monitor size</em> and
            <em>viewing distance</em>.
          </p>

          <canvas id="fov-preview" ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>

          <p className="caption">
            Top view: horizontal FoV; side view: vertical FoV. Thick red bar
            represents monitor.
          </p>

          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >

            <Form.Item label="Curvature (R)">
              <Slider
                value={curvature}
                min={0}
                max={180}
                marks={{
                  0: 'flat',
                  80: '800R',
                  100: '1000R',
                  150: '1500R',
                  180: '1800R',
                }}
                onChange={setCurvature}
              />
            </Form.Item>

            <Form.Item label="Triple Monitor">
              <Checkbox
                value={isTripleMonitor}
                onChange={e => {
                  console.log(e)
                  setIsTripleMonitor(e.target.checked)
                }}
              />
            </Form.Item>

            <Form.Item label="Triple Monitor Angle">
              <Slider
                value={tripleMonitorAngle}
                min={0}
                max={90}
                marks={{
                  0: '0',
                  30: '30',
                  60: '60',
                  70: '70',
                  90: '90',
                }}
                onChange={setTripleMonitorAngle}
              />
            </Form.Item>
            <Form.Item label="Distance to screen (cm)">
              <Slider
                value={distanceToScreen}
                min={40}
                max={200}
                marks={{
                  40: '40',
                  50: '50',
                  70: '70',
                  100: '100',
                  150: '150',
                  200: '200',
                }}
                onChange={setDistanceToScreen}
              />
            </Form.Item>

            <Form.Item label="Screen Size (inch)">
              <Slider
                value={screenSize}
                min={5}
                max={100}
                marks={{
                  5: '5',
                  15: '15',
                  24: '24',
                  27: '27',
                  32: '32',
                  40: '40',
                  48: '48',
                  55: '55',
                  60: '60',
                  65: '65',
                  75: '75',
                  85: '85',
                }}
                onChange={setScreenSize}
              />
            </Form.Item>


            <Form.Item label="Aspect Ratio">
              <Select
                value={aspectRatio}
                style={{ width: 120 }}
                onChange={setAspectRatio}
              >
                <Option value={16 / 9}>16:9</Option>
                <Option value={16 / 10}>16:10</Option>
                <Option value={4 / 3}>4:3</Option>
                <Option value={21 / 9}>21:9</Option>
                <Option value={32 / 9}>32:9</Option>
              </Select>
            </Form.Item>




          </Form>

        </div >
      </main >

      <footer className={styles.footer}>
        Made in China
      </footer>
    </div >
  )
}

export default Home
