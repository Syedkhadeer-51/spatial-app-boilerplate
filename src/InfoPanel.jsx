// InfoPanel.jsx
import { Container, Text } from '@react-three/uikit';
import React from 'react';
import * as THREE from 'three';
import { Button } from './components/apfel/button';
import { Card } from './components/apfel/card';
import { Tabs, TabsButton } from './components/apfel/tabs';
import { TabBar, TabBarItem } from './components/apfel/tab-bar';
import { Slider } from './components/apfel/slider';
import { Checkbox } from './components/apfel/checkbox';
import {AlignVerticalSpaceBetween, 
        AlignVerticalDistributeStart, 
        AlignVerticalDistributeEnd,
        Cone, 
        Box,
        Circle,
        Scaling,
        Download

        
      } from '@react-three/uikit-lucide';


function InfoPanel({
  object,
  onClose,
  onColorChange,
  onMaterialChange,
  onWireframeToggle,
  onTransparentToggle,
  onOpacityChange,
  onDepthTestToggle,
  onDepthWriteToggle,
  onAlphaHashToggle,
  onSideChange,
  onFlatShadingToggle,
  onVertexColorsToggle,
  onGeometryChange,
  onSizeChange,
  onExport,
}) {
  if (!object) return null;

  const { geometry, material, name } = object;
  const materialTypes = [
    'MeshBasicMaterial',
    'MeshLambertMaterial',
    'MeshPhongMaterial',
    'MeshStandardMaterial',
    'MeshNormalMaterial',
    'MeshPhysicalMaterial',
    'MeshToonMaterial',
    'MeshMatcapMaterial'
  ];
  const sideOptions = [
    { label: 'Front Side', value: THREE.FrontSide, ico: <AlignVerticalDistributeStart /> },
    { label: 'Back Side', value: THREE.BackSide, ico: <AlignVerticalDistributeEnd/> },
    { label: 'Double Side', value: THREE.DoubleSide, ico: <AlignVerticalSpaceBetween /> }
  ];
  const geometryOptions = [
    { label: 'Cone', value: 'ConeGeometry', ico:<Cone/> },
    { label: 'Cube', value: 'BoxGeometry', ico:<Box/>},
    { label: 'Sphere', value: 'SphereGeometry', ico: <Circle/>},
  ];

  return (
    <group>
      <Card positionRight={600} positionTop={400} borderRadius={32} padding={16} gap={8} flexDirection="column" overflow={'hidden'}>
        <Container className="info-close">
          <Button className="close-button" onClick={onClose}>
            <Text>Hide options</Text>
          </Button>
        </Container>
        
        <Container flexDirection="column">
          <Text fontSize={25}>{name ? name : 'Unnamed'}</Text>
          <Text fontSize={18} opacity={0.5}>Type:</Text>
          <Text fontSize={14}>{geometry.type}</Text>
          <Text fontSize={18} opacity={0.5}>Material:</Text>
          <Text fontSize={14}>{material.type}</Text>
        </Container>
      </Card>
      
      <Container positionRight={600} fontSize={10} borderRadius={32} padding={2} flexDirection="column" alignItems="flex-start" gapRow={16} opacity={0}>
        <TabBar value={material.side} onValueChange={(value) => onSideChange(object, value)}>
          {sideOptions.map((option) => (
            <TabBarItem key={option.value} value={option.value} icon={option.ico}>
              <Text>{option.label}</Text>
            </TabBarItem>
          ))}
        </TabBar>
      </Container>
      <Container positionLeft={0} fontSize={10} borderRadius={32} padding={20} flexDirection="column" alignItems="flex-start" gapRow={16} opacity={0}>
        <Tabs value={geometry.type} onValueChange={(value) => onGeometryChange(object, value)}>
          {geometryOptions.map((option) => (
            <TabsButton key={option.value} value={option.value} >
              {option.ico}
            </TabsButton>
          ))}
        </Tabs>
      </Container>

      <Container padding={20} flexDirection="row" gapColumn={6} alignItems="flex-start"  opacity={5}>
      <Scaling color={"white"} padding={0} borderRadius={32} fontSize={20} size={100} positionBottom={3} scale={50}/>
        <Slider Text="Size" icon={Scaling} size="xs" range={1} step={0.1} value={object.scale.x} onValueChange={(value) => onSizeChange(object, value)} width={250}/>
      
      </Container>
      
      <Container padding={20} flexDirection="row" gapColumn={6} alignItems="flex-start"  opacity={5}>
        <Checkbox selected={material.wireframe} onSelectedChange={() => onWireframeToggle(object)}></Checkbox>
        <Text positionTop={2} fontSize={20} color={"white"}>Wireframe</Text>
      </Container>
      
      
      
      
      <Container positionTop={110} positionRight={300} flexDirection="column" md={{ flexDirection: 'row' }} gap={32}>
      <Button Variant="icon" onClick={onExport} size="lg" backgroundColor={'grey'} backgroundOpacity={0.35} icon={Download}>
        <Text>Download file</Text>
      </Button>
      </Container>

      
    </group>  
  );
}

export default InfoPanel;


