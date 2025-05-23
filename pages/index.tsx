import dynamic from 'next/dynamic'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { Selector, Form, Slider, Button, Input } from 'antd-mobile';
import { GoogleAnalytics } from '@next/third-parties/google'


import { useTranslation } from 'react-i18next';
import i18n from '../src/i18n';
import styles from '../styles/Home.module.css'
import { t } from 'i18next';
import React from 'react';
import { useStickyState } from '../utils/useStickyState';
import { GameList } from '../src/games';


const MONITOR_COLOR = '#f00';
const MONITOR_THICKNESS = 5;
const HEAD_SIZE = 6;
const CAR_LENGTH = 424; // centimetres, used to calculate scale for monitors
const BACKGROUND_COLOR = '#ffffff';
const TEXT_COLOR = '#666666';
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 560;
const xOffset = 0;


let headPositions = {
  normX: 0.555, // normalized value, 0-1
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


  const currPath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/${window.location.pathname}`;
  const topImage = await getImage(`${currPath}/assets/images/brz_top.jpg`)
  const sideImage = await getImage(`${currPath}/assets/images/brz_side.jpg`)
  // fill canvas with white background
  ctx.globalAlpha = 1;
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.globalAlpha = 0.5;

  ctx.drawImage(topImage, 0, 0);
  ctx.drawImage(sideImage, 0, topImage.height + 80);

  console.log(topImage.height, topImage.width)
  headPositions.x = topImage.width * headPositions.normX;
  headPositions.ty = topImage.height * headPositions.normTY;
  headPositions.sy = sideImage.height * headPositions.normSY + topImage.height + 80;
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

const drawDistanceLine = (
  ctx: CanvasRenderingContext2D,
  topMonX: number,
  headX: number,
  headSY: number,
  distanceToScreen: number,
) => {
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(topMonX, headSY);
  ctx.lineTo(headX - 32, headSY);
  ctx.moveTo(headX - 5, headSY);
  ctx.lineTo(headX, headSY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = 1;
  const textSize = 10;
  ctx.fillText(`${distanceToScreen} cm`, topMonX + 5, headSY - textSize / 2)
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

const drawLengthCalibration = (
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
  ctx.moveTo(toX - 20, centerY - totalWidth / 2);
  ctx.lineTo(toX + 20, centerY - totalWidth / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX - 20, centerY + totalWidth / 2);
  ctx.lineTo(toX + 20, centerY + totalWidth / 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
  const textSize = 10;
  ctx.fillText(`${(totalWidth / carScale + 2).toFixed(1)} cm`, toX, centerY - totalWidth / 2 - textSize / 2)
}

const drawSpecText = (
  ctx: CanvasRenderingContext2D,
  screenSize: number,
  isTripleMonitor: boolean,
  tripleMonitorAngle: number,
  aspectRatioA: number,
  aspectRatioB: number,
  curvature: number,
  headSY: number,
) => {
  ctx.globalAlpha = 1;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "15px Arial";
  ctx.fillText(`${screenSize}${t("inch")} ${isTripleMonitor ? `${t("tripleMonitor")} ${tripleMonitorAngle}\u00B0 ${t("angle")}` : ""}`, 10, headSY - 30);
  ctx.fillText(`${aspectRatioA}:${aspectRatioB} ${curvature > 0 ? `${curvature}0R` : t("flat")}`, 10, headSY - 10);
}

const drawWatermark = (ctx: CanvasRenderingContext2D) => {
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "15px Arial";
  const watermark = "fovcalc.xusf.xyz"
  ctx.fillText(watermark, 370, 15);
  ctx.fillText(watermark, 170, CANVAS_HEIGHT - 10);
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
  distanceToScreen: number,
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
  drawDistanceLine(ctx, topMonX, headX, headSY, distanceToScreen);

  drawLengthCalibration(ctx, monitorInfo.h, headSY, sideMonX - 12);

  // top view, center monitor
  ctx.lineWidth = MONITOR_THICKNESS;
  if (curveRadius <= 0) {
    drawLine(ctx, topMonX, monTY, monTY + monitorInfo.w);
  } else {
    drawVerticalArc(ctx, topMonX, monTY, monTY + monitorInfo.w, curveRadius * carScale);
  }
  drawAngle(ctx, headX, headTY, topMonX, monTY, topMonX, monTY + monitorInfo.w, -30, 0, horizontalSingleAngleNum);

  let topViewSidePointX = topMonX - 12;

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

    topViewSidePointX = topMonX + sinX;
  }

  drawLengthCalibration(ctx, totalWidth, headTY, topViewSidePointX);


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
): number => {
  if (fromX !== toX) {
    // won't calculate
    return -1
  }
  const yDiff = Math.abs(fromY - toY)
  const radius = Math.sqrt((fromX - centerX) ** 2 + (fromY - centerY) ** 2)
  const angle = Math.abs(Math.asin(yDiff / 2 / radius));
  const angleNum = angle / Math.PI * 180 * 2;

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

  const [language, setLanguage] = useStickyState(navigator.language === "zh-CN" ? "cn" : "en", "language");

  const [distanceToScreen, setDistanceToScreen] = useStickyState(70, "distanceToScreen");
  const [screenSize, setScreenSize] = useStickyState(32, "screenSize");
  const [aspectRatioA, setAspectRatioA] = useStickyState(16, "aspectRatioA");
  const [aspectRatioB, setAspectRatioB] = useStickyState(9, "aspectRatioB");
  const [curvature, setCurvature] = useStickyState(0, "curvature")
  const [isTripleMonitor, setIsTripleMonitor] = useStickyState(true, "isTripleMonitor")
  const [tripleMonitorAngle, setTripleMonitorAngle] = useStickyState(60, "tripleMonitorAngle");
  const [showCustomAspectRatioInput, setShowCustomAspectRatioInput] = useState(false);
  const [showCustomCurvatureInput, setShowCustomCurvatureInput] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [gameFovs, setGameFovs] = useState<Record<string, string | number>>(() => {
    const initialFovs: Record<string, string | number> = {
      vFov: 0,
      hFov: 0,
    };

    // 初始化所有游戏的 FOV 值
    Object.keys(GameList).forEach(gameKey => {
      initialFovs[gameKey] = "";
    });

    return initialFovs;
  });

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
        Math.round(verticalAngleNum),
        Math.round(horizontalSingleAngleNum),
        Math.round(horizontalTripleAngleNum),
        totalWidth,
        distanceToScreen,
      )

      drawSpecText(
        ctx,
        screenSize,
        isTripleMonitor,
        tripleMonitorAngle,
        aspectRatioA,
        aspectRatioB,
        curvature,
        headPositions.sy
      )

      drawWatermark(ctx)

      // 计算所有游戏的 FOV 值
      const newGameFovs: Record<string, string | number> = {
        vFov: Math.round(verticalAngleNum),
        hFov: Math.round(horizontalTripleAngleNum),
      };

      // 根据游戏类型计算对应的 FOV 值
      Object.entries(GameList).forEach(([gameKey, gameInfo]) => {
        let fovValue: string | number = "";

        switch (gameInfo.type) {
          case "cmf1-16-18":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 0.05, -1), 1)).toFixed(gameInfo.digits);
            break;
          case "cmf1-19-20":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 0.1, -10), 10)).toFixed(gameInfo.digits);
            break;
          case "cmf1-21":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 1, -20), 20)).toFixed(gameInfo.digits);
            break;
          case "hfov-rad":
            fovValue = (verticalAngleNum / 180 * Math.PI).toFixed(gameInfo.digits);
            break;
          case "hfov-deg":
            fovValue = horizontalTripleAngleNum.toFixed(gameInfo.digits);
            break;
          case "vfov-deg":
            fovValue = verticalAngleNum.toFixed(gameInfo.digits);
            break;
          case "vfov-degx2":
            fovValue = (verticalAngleNum * 2).toFixed(gameInfo.digits);
            break;
          case "vfov-gtr2":
            fovValue = Math.max(Math.min(1.5, (verticalAngleNum / 58)), 0.5).toFixed(gameInfo.digits);
            break;
          case "vfov-race07":
            fovValue = Math.max(Math.min(1.5, (verticalAngleNum / 58)), 0.4).toFixed(gameInfo.digits);
            break;

        }

        newGameFovs[gameKey] = fovValue;
      });

      setGameFovs(newGameFovs);
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

  const handleExportCanvasAsImage = () => {
    const canvas = document.getElementById('fov-preview') as HTMLCanvasElement;
    const dataURL = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `fov-preview-${screenSize}${isTripleMonitor ? "x3" : ""}-${tripleMonitorAngle}.jpeg`;
    a.click();
  }

  // 过滤游戏列表
  const filteredGames = Object.entries(GameList).filter(([_, gameInfo]) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      gameInfo.en.replace(/ /g, "").toLowerCase().includes(searchLower) ||
      gameInfo.cn.replace(/ /g, "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>fov calculator</title>
        <meta name="description" content="sim racing cockpit fov calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GoogleAnalytics gaId="G-GN8YEE6FBQ" />

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

          <Button onClick={handleExportCanvasAsImage} color='primary' fill='outline' style={{ position: 'absolute', right: 10, top: 20 }}>{t("export_canvas")}</Button>
        </div>


        <div className={styles.body}>
          <div className={styles.display}>
            <canvas id="fov-preview" ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
            <div className={styles.gameFovData}>
              {t("horizontalFov")} {gameFovs.hFov}°<br />
              {t("verticalFov")} {gameFovs.vFov}°<br />
              <div style={{ marginTop: '0px', width: '100%', }}>
                <Input
                  placeholder={t("search_games")}
                  clearable
                  value={searchText}
                  onChange={setSearchText}
                  style={{ marginBottom: '0px', marginLeft: '0px', fontSize: '12px' }}
                />
                <div style={{
                  maxHeight: '100px',
                  overflowY: 'auto',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  padding: '0px'
                }}>
                  {filteredGames.map(([gameKey, gameInfo]) => (
                    <div key={gameKey} style={{
                      padding: '4px 0',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                      <span>{t(`game_${gameKey}`)}</span>
                      <span style={{ marginLeft: '8px' }}>{gameFovs[gameKey]}{gameInfo.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          <Form
            className={styles.mainform}
            name="basic"
            style={{ width: '360px' }}
          >
            <Form.Item>
              <Selector
                columns={2}
                options={
                  [
                    { value: "0", label: t("singleMonitor") },
                    { value: "1", label: t("tripleMonitor") },
                  ]
                }
                value={[isTripleMonitor ? "1" : "0"]}
                onChange={(e: ("" | "0" | "1")[]) => { setIsTripleMonitor(e[0] === "1") }}
              />
            </Form.Item>

            <Form.Item label={`${t("tripleMonitorAngle")}: ${tripleMonitorAngle}`}>
              <Slider
                disabled={!isTripleMonitor}
                value={tripleMonitorAngle}
                min={0}
                max={90}
                popover
                onChange={(e) => setTripleMonitorAngle(e as number)}
              />
            </Form.Item>

            <Form.Item label={`${t("distanceToScreen")}: ${distanceToScreen} ${t("cm")}`}>
              {/* <Input type="number" value={`${distanceToScreen}`} onChange={(e) => setDistanceToScreen(parseInt(e))} /> */}
              <Slider
                value={distanceToScreen}
                min={40}
                max={200}
                popover
                onChange={(e) => setDistanceToScreen(e as number)}
              />
            </Form.Item>
            <Form.Item label={`${t("screenSize")}: ${screenSize} ${t("inch")}`}>
              {/* <Input type="number" value={screenSize} onChange={setScreenSize} /> */}
              <Slider
                value={screenSize}
                min={5}
                max={110}
                popover
                onChange={(e) => setScreenSize(e as number)}
              />
            </Form.Item>

            <div style={{ height: 88 }}>
              {showCustomAspectRatioInput ? (
                <Form.Item label={`${t("aspectRatio")}: ${aspectRatioA} : ${aspectRatioB}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', justifyContent: 'flex-start' }}>
                      <Input type="number" value={aspectRatioA} onChange={setAspectRatioA} style={{ width: '70px', '--text-align': 'center' }} />
                      <span style={{ lineHeight: '23px' }}>:</span>
                      <Input type="number" value={aspectRatioB} onChange={setAspectRatioB} style={{ width: '70px', '--text-align': 'center' }} />
                    </div>
                    <Button
                      fill="outline"
                      color="primary"
                      onClick={() => setShowCustomAspectRatioInput(false)}
                    >
                      {t("back")}
                    </Button>
                  </div>
                </Form.Item>
              ) : (
                <Form.Item label={`${t("aspectRatio")}: ${aspectRatioA} : ${aspectRatioB}`}>
                  <Selector
                    columns={4}
                    options={[
                      { value: "16:9", label: "16:9" },
                      { value: "21:9", label: "21:9" },
                      { value: "32:9", label: "32:9" },
                      { value: "0:0", label: t("custom") },
                    ]}
                    value={[`${aspectRatioA}:${aspectRatioB}`]}
                    onChange={(e: `${number}:${number}`[]) => {
                      if (e[0] === "0:0") {
                        setShowCustomAspectRatioInput(true);
                        return;
                      }
                      const values = e[0].split(":");
                      setAspectRatioA(parseInt(values[0]));
                      setAspectRatioB(parseInt(values[1]));
                    }}
                  />
                </Form.Item>
              )}
            </div>

            <div style={{ height: '158px' }}>
              {showCustomCurvatureInput ? (
                <Form.Item label={`${t("curvature")}: ${curvature > 0 ? `${curvature}0R` : t("flat")}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Input
                        type="number"
                        value={curvature === 0 ? "0" : `${curvature * 10}`}
                        onChange={(val) => setCurvature(parseInt(val) / 10)}
                        style={{ width: '100px', '--text-align': 'center' }}
                      />
                      <span>R</span>
                    </div>
                    <Button
                      fill="outline"
                      color="primary"
                      onClick={() => setShowCustomCurvatureInput(false)}
                    >
                      {t("back")}
                    </Button>
                  </div>
                </Form.Item>
              ) : (
                <Form.Item label={`${t("curvature")}: ${curvature > 0 ? `${curvature}0R` : t("flat")}`}>
                  <Selector
                    columns={4}
                    options={[
                      { value: 80, label: "800R" },
                      { value: 100, label: "1000R" },
                      { value: 150, label: "1500R" },
                      { value: 180, label: "1800R" },
                      { value: 230, label: "2300R" },
                      { value: 380, label: "3800R" },
                      { value: 0, label: t("flat") },
                      { value: -1, label: t("custom") },
                    ]}
                    value={[curvature]}
                    onChange={(e: number[]) => {
                      if (e[0] === -1) {
                        setShowCustomCurvatureInput(true);
                        return;
                      }
                      setCurvature(e[0]);
                    }}
                  />
                </Form.Item>
              )}
            </div>

          </Form>

        </div >
      </main >

      <footer className={styles.footer}>
        Made in China, By <a href="https://github.com/nicholasxuu/">nicholasxuu</a>
      </footer>
    </div >
  )
}

// disable SSR
export default dynamic(() => Promise.resolve(Home), { ssr: false })
