import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { Selector, Form, Slider, Input } from 'antd-mobile';

import { useTranslation } from 'react-i18next';
import i18n from '../src/i18n';
import styles from '../styles/Home.module.css'


const MONITOR_COLOR = '#f00';
const MONITOR_THICKNESS = 5;
const FOV_COLOR = '#d77';
const HEAD_SIZE = 6;
const CAR_LENGTH = 424; // centimetres, used to calculate scale for monitors
const BACKGROUND_COLOR = '#9dbbcc';
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 490;
const xOffset = 0;

const commonDisplayConfigs = [
  {
    aspectDisplay: "16:9",
    aspectRatio: 16 / 9,
  }
]

let headPositions = {
  normX: 0.57, // normalized value, 0-1
  normTY: 0.67,
  normSY: 0.22,
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

  const currPath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/${window.location.pathname}`;
  const topImage = await getImage(`${currPath}/assets/images/brz_top.jpg`)
  const sideImage = await getImage(`${currPath}/assets/images/brz_side.jpg`)
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
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = MONITOR_COLOR;

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
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = MONITOR_COLOR;

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
  angleNum: number = 0,
) => {
  ctx.globalAlpha = 1;
  ctx.strokeStyle = MONITOR_COLOR;

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
    ctx.globalAlpha = 1;
    const textSize = 10;
    ctx.fillText(`${angleNum}\u00b0`, centerX + textOffsetX, centerY + textOffsetY + textSize / 2)
  }
}

const drawWidth = (
  ctx: CanvasRenderingContext2D,
  totalWidth: number,

  centerY: number,
  toX: number,
) => {
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = MONITOR_COLOR;



  ctx.lineWidth = 1;

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(toX, centerY - totalWidth / 2);
  ctx.lineTo(toX, centerY + totalWidth / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(toX - 50, centerY - totalWidth / 2);
  ctx.lineTo(toX + 50, centerY - totalWidth / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX - 50, centerY + totalWidth / 2);
  ctx.lineTo(toX + 50, centerY + totalWidth / 2);
  ctx.stroke();



  ctx.globalAlpha = 1;
  const textSize = 10;
  ctx.fillText(`${(totalWidth / carScale + 2).toFixed(1)} cm`, toX, centerY - totalWidth / 2 - textSize / 2)
}

const drawMonitors = (
  ctx: CanvasRenderingContext2D,
  curveRadius: number, // cm
  isTripleMonitor: boolean,
  monitorInfo: any,
  displayPos: any,
  verticalAngleNum: number,
  horizontalSingleAngleNum: number,
  horizontalTripleAngleNum: number,
  totalWidth: number,
) => {
  console.log("draw monitors");
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = MONITOR_COLOR;

  const {
    headX,
    headTY,
    headSY,
    topMonX,
    sideMonX,
    monTY,
    monSY,
    monLeftY,
    monRightY,
    tripleAngle,
  } = displayPos;

  // side view, center monitor front
  ctx.lineWidth = MONITOR_THICKNESS;
  drawLine(ctx, sideMonX, monSY, monSY + monitorInfo.h);
  drawAngle(ctx, headX, headSY, sideMonX, monSY, sideMonX, monSY + monitorInfo.h, -30, 0, verticalAngleNum);

  // top view, center monitor
  ctx.lineWidth = MONITOR_THICKNESS;
  if (curveRadius <= 0) {
    drawLine(ctx, topMonX, monTY, monTY + monitorInfo.w);
  } else {
    drawVerticalArc(ctx, topMonX, monTY, monTY + monitorInfo.w, curveRadius * carScale);
  }
  drawAngle(ctx, headX, headTY, topMonX, monTY, topMonX, monTY + monitorInfo.w, -30, 0, horizontalSingleAngleNum);

  if (isTripleMonitor) {
    // top view, left monitor
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(topMonX + MONITOR_THICKNESS / 2, monLeftY);
    ctx.rotate((-tripleAngle * Math.PI) / 180);
    ctx.translate(-topMonX - MONITOR_THICKNESS / 2, -monLeftY);
    ctx.lineWidth = MONITOR_THICKNESS;

    if (curveRadius <= 0) {
      drawLine(ctx, topMonX, monLeftY, monLeftY + monitorInfo.w);
    } else {
      drawVerticalArc(ctx, topMonX, monLeftY, monLeftY + monitorInfo.w, curveRadius * carScale);
    }

    // top view, right monitor
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(topMonX + MONITOR_THICKNESS / 2, monRightY);
    ctx.rotate(((tripleAngle) * Math.PI) / 180);
    ctx.translate(-topMonX - MONITOR_THICKNESS / 2, -monRightY);
    ctx.lineWidth = MONITOR_THICKNESS;

    if (curveRadius <= 0) {
      drawLine(ctx, topMonX, monRightY - monitorInfo.w, monRightY);
    } else {
      drawVerticalArc(ctx, topMonX, monRightY - monitorInfo.w, monRightY, curveRadius * carScale);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const sinX = monitorInfo.w * Math.sin(tripleAngle * Math.PI / 180)
    const cosY = monitorInfo.w * Math.cos(tripleAngle * Math.PI / 180)
    drawAngle(ctx, headX, headTY, topMonX + sinX, monTY - cosY, topMonX + sinX, monTY + monitorInfo.w + cosY, 10, 0, horizontalTripleAngleNum);

    drawWidth(ctx, totalWidth, headTY, topMonX + sinX);
  }


}

const getMonitor = (screenSize: number, aspectRatio: number, curveRadius: number): any => {
  const realWidth = (2.54 * screenSize) * (aspectRatio / Math.sqrt(1 + aspectRatio * aspectRatio))
  const realHeight = realWidth / aspectRatio
  const width = carScale * realWidth
  const height = carScale * realHeight

  const mon = {
    thickness: 0,
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
  console.log("monitor info", mon)
  return mon
}

const calcAngleNum = (
  centerX: number,
  centerY: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) => {
  if (fromX !== toX) {
    // won't calculate
    return -1
  }
  const yDiff = Math.abs(fromY - toY)
  const radius = Math.sqrt((fromX - centerX) ** 2 + (fromY - centerY) ** 2)
  const angle = Math.abs(Math.asin(yDiff / 2 / radius));
  const angleNum = Math.round(angle / Math.PI * 180 * 2);

  if (centerX < fromX) {
    return 360 - angleNum;
  }
  return angleNum;
}

const calculateDisplayXYPos = (
  distanceToScreen: number,
  monitorInfo: any,
  tripleMonitorAngle: number,
) => {
  var headX = headPositions.x + xOffset;
  var headTY = headPositions.ty;
  var headSY = headPositions.sy;

  var topMonX = headX - distanceToScreen * carScale + monitorInfo.thickness;
  var sideMonX = headX - distanceToScreen * carScale;

  var monTY = headTY - monitorInfo.w / 2;
  var monSY = headSY - monitorInfo.h / 2;
  var tripleAngle = tripleMonitorAngle;

  var monLeftY = headTY + monitorInfo.w / 2;
  var monRightY = headTY - monitorInfo.w / 2;

  return {
    headX,
    headTY,
    headSY,
    topMonX,
    sideMonX,
    monTY,
    monSY,
    monLeftY,
    monRightY,
    tripleAngle,
  }
}


const Home: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)

  const { t } = useTranslation();

  const [distanceToScreen, setDistanceToScreen] = useState(70);
  const [language, setLanguage] = useState("cn");
  const [screenSize, setScreenSize] = useState(32);
  const [aspectRatioA, setAspectRatioA] = useState(16);
  const [aspectRatioB, setAspectRatioB] = useState(9);
  const [curvature, setCurvature] = useState(0)
  const [isTripleMonitor, setIsTripleMonitor] = useState(true)
  const [tripleMonitorAngle, setTripleMonitorAngle] = useState(60);

  const [gameFovs, setGameFovs] = useState({
    vFov: 0,
    hFov: 0,
    richardBurnsRally: "",
    f120162018: "",
    f120192020: "",
    f12021: "",
    dirtrally: 0,
    gtr2: 0,
  })

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language]);

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


      const aspectRatio = aspectRatioA / aspectRatioB;
      const monitorInfo = getMonitor(screenSize, aspectRatio, curvature)
      const displayPos = calculateDisplayXYPos(distanceToScreen, monitorInfo, tripleMonitorAngle);
      const verticalAngleNum = calcAngleNum(
        headPositions.x + xOffset,
        headPositions.sy,
        displayPos.sideMonX,
        displayPos.monSY,
        displayPos.sideMonX,
        displayPos.monSY + monitorInfo.h
      )
      const horizontalSingleAngleNum = calcAngleNum(
        headPositions.x + xOffset,
        headPositions.ty,
        displayPos.topMonX,
        displayPos.monTY,
        displayPos.topMonX,
        displayPos.monTY + monitorInfo.w
      )
      let horizontalTripleAngleNum = 0;
      let totalWidth = monitorInfo.w;
      if (isTripleMonitor) {
        const tripleSinX = monitorInfo.w * Math.sin(tripleMonitorAngle * Math.PI / 180)
        const tripleCosY = monitorInfo.w * Math.cos(tripleMonitorAngle * Math.PI / 180)
        horizontalTripleAngleNum = calcAngleNum(
          headPositions.x + xOffset,
          headPositions.ty,
          displayPos.topMonX + tripleSinX,
          displayPos.monTY - tripleCosY,
          displayPos.topMonX + tripleSinX,
          displayPos.monTY + monitorInfo.w + tripleCosY,
        )
        totalWidth = monitorInfo.w + 2 * monitorInfo.w * Math.cos(tripleMonitorAngle * Math.PI / 180)
      } else {
        horizontalTripleAngleNum = horizontalSingleAngleNum;
      }


      drawMonitors(
        ctx,
        curvature,
        isTripleMonitor,
        monitorInfo,
        displayPos,
        verticalAngleNum,
        horizontalSingleAngleNum,
        horizontalTripleAngleNum,
        totalWidth,
      )

      // horizontalTripleAngleNum from angle number to radians
      const hFovRad = (verticalAngleNum / 180 * Math.PI).toFixed(4)
      const f120162018 = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 0.05, -1), 1)).toFixed(2);
      const f120192020 = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 0.1, -10), 10)).toFixed(1);
      const f12021 = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 1, -20), 20)).toFixed(0);
      setGameFovs({
        vFov: verticalAngleNum,
        hFov: horizontalTripleAngleNum,
        richardBurnsRally: hFovRad,
        f120162018: f120162018,
        f120192020: f120192020,
        f12021: f12021,
        dirtrally: 0,
        gtr2: 0,
      })
    }

    drawCanvas();

  }, [
    distanceToScreen,
    screenSize,
    aspectRatioA,
    aspectRatioB,
    curvature,
    isTripleMonitor,
    tripleMonitorAngle,
  ])

  return (
    <div className={styles.container}>
      <Head>
        <title>fov calculator</title>
        <meta name="description" content="sim racing cockpit fov calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <Selector
            options={
              [
                { value: "en", label: "English" },
                { value: "cn", label: "中文" },
              ]
            }
            defaultValue={[language]}
            onChange={(e) => { setLanguage(e[0]) }}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.display}>
            <canvas id="fov-preview" ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
            <div className={styles.gameFovData}>
              {t("verticalFov")}: {gameFovs.vFov}°<br />
              {t("horizontalFov")}: {gameFovs.hFov}°<br />
              {t("richardburnsrally")}: {gameFovs.richardBurnsRally} rad<br />
              {t("f120162018")}: {gameFovs.f120162018}<br />
              {t("f120192020")}: {gameFovs.f120192020}<br />
              {t("f12021")}: {gameFovs.f12021}<br />
              {/* {t("dirtrally")}: {gameFovs.dirtrally}<br />
              {t("gtr2")}: {gameFovs.gtr2}<br /> */}
            </div>
          </div>


          <Form
            className={styles.mainform}
            name="basic"
          >
            <Form.Item label={t("tripleMonitor")}>
              <Selector
                columns={2}
                options={
                  [
                    { value: "0", label: t("singleMonitor") },
                    { value: "1", label: t("tripleMonitor") },
                  ]
                }
                defaultValue={[isTripleMonitor ? "1" : ""]}
                onChange={(e) => { setIsTripleMonitor(e[0] === "1") }}
              />
            </Form.Item>

            <Form.Item label={t("tripleMonitorAngle")}>
              <Slider
                disabled={!isTripleMonitor}
                value={tripleMonitorAngle}
                min={0}
                max={90}
                onChange={(e) => {
                  // console.log("!!!!", e);
                  setTripleMonitorAngle(e)
                }}
              />
            </Form.Item>

            <Form.Item label={t("distanceToScreen")}>
              <Input type="number" value={`${distanceToScreen}`} onChange={(e) => setDistanceToScreen(parseInt(e))} />cm
              <br />
              <Slider
                value={distanceToScreen}
                min={40}
                max={200}
                onChange={(e) => {
                  // console.log("!!!!", e);
                  setDistanceToScreen(e)
                }}
              />
            </Form.Item>
            {/* 
            <Form.Item label={t("screenSize")}>
              <Input type="number" value={screenSize} onChange={setScreenSize} />{`${t("inch")}`}
              <br />
              <Slider
                value={screenSize}
                min={5}
                max={85}
                marks={{
                  15: '15',
                  27: '27',
                  32: '32',
                  55: '55',
                  65: '65',
                  75: '75',
                  85: '85',
                }}
                onChange={setScreenSize}
              />
            </Form.Item>


            <Form.Item label={t("aspectRatio")}>
              <Input type="number" value={aspectRatioA} onChange={setAspectRatioA} /> / <Input type="number" value={aspectRatioB} onChange={setAspectRatioB} />
              <br />
              <Select
                value={`${aspectRatioA}:${aspectRatioB}`}
                style={{ width: 120 }}
                onChange={(e: string) => {
                  const values = e.split(":")
                  setAspectRatioA(parseInt(values[0]))
                  setAspectRatioB(parseInt(values[1]))
                }}
              >
                <Option value={"16:9"}>16:9</Option>
                <Option value={"16:10"}>16:10</Option>
                <Option value={"4:3"}>4:3</Option>
                <Option value={"21:9"}>21:9</Option>
                <Option value={"32:9"}>32:9</Option>
              </Select>

            </Form.Item>

            <Form.Item label={t("curvature")}>
              <Input type="number" value={`${curvature === 0 ? t("flat") : curvature * 10}`} onChange={(e) => setCurvature(parseInt(e) / 10)} />R
              <br />
              <Radio.Group value={`${curvature}`} onChange={(e) => setCurvature(parseInt(e.target.value))}>
                <Radio.Button value="80">800R</Radio.Button>
                <Radio.Button value="100">1000R</Radio.Button>
                <Radio.Button value="150">1500R</Radio.Button>
                <Radio.Button value="180">1800R</Radio.Button>
                <Radio.Button value="300">3000R</Radio.Button>
                <Radio.Button value="0">{t("flat")}</Radio.Button>
              </Radio.Group>
            </Form.Item> */}


          </Form>

        </div >
      </main >

      <footer className={styles.footer}>
        Made in China, By <a href="https://github.com/nicholasxuu/">nicholasxuu</a>
      </footer>
    </div >
  )
}

export default Home
