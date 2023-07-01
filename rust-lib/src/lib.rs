mod utils;

use std::collections::HashMap;

use js_sys::{Array, Map};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn main_js() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

//
// The Translation matrix is a 2x1 matrix that is used to translate a vector in a 2D plane.
// The matrix is defined as:
// 
// | x |
// | y |
//

#[wasm_bindgen]
struct TranslationMatrix {
    x: f64,
    y: f64,
}

#[wasm_bindgen]
impl TranslationMatrix {
    fn new(x: f64, y: f64) -> TranslationMatrix {
        TranslationMatrix { x, y }
    }

    fn get_x(&self) -> f64 {
        self.x
    }

    fn get_y(&self) -> f64 {
        self.y
    }
}

//
// The Rotation matrix is a 2x2 matrix that is used to rotate a vector in a 2D plane.
// The matrix is defined as:
//
// | xx xy |
// | yx yy |
//

#[wasm_bindgen]
struct RotationMatrix {
    xx: f64,
    xy: f64,
    yx: f64,
    yy: f64,
}

#[wasm_bindgen]
impl RotationMatrix {
    fn new(xx: f64, xy: f64, yx: f64, yy: f64) -> RotationMatrix {
        RotationMatrix { xx, xy, yx, yy }
    }

    fn get_xx(&self) -> f64 {
        self.xx
    }

    fn get_xy(&self) -> f64 {
        self.xy
    }

    fn get_yx(&self) -> f64 {
        self.yx
    }

    fn get_yy(&self) -> f64 {
        self.yy
    }
}

//
// The Point struct is one used to represent the coordinates of a point.
//

#[wasm_bindgen]
struct Point {
    x: f64,
    y: f64,
}

// 
// The Transformation struct is one used to return the Translation and Rotation matrices,
// as well as the transformed sensors to the JavaScript caller.
//

#[wasm_bindgen]
struct Transformation {
    translation: TranslationMatrix,
    rotation: RotationMatrix,
    sensor_matrix: Array,
}

#[wasm_bindgen]
struct SensorReading {
    x: f64,
    y: f64,
    signal_strength: f64,
    bt_id: i32,
}

//
// Main function that is called from Typescript to transform the sensor matrices.
// The function takes an array of floats that represent the sensor readings.
//

#[wasm_bindgen]
pub fn transform_sensor_matrices(array: Array) {

    

}

fn transform_to_sensor_readings(array: Array) -> Vec<SensorReading> {
    let mut sensor_readings: Vec<SensorReading> = Vec::new();

    let mut current_sensor_reading: SensorReading = SensorReading { x: 0.0, y: 0.0, signal_strength: 0.0, bt_id: 0 };
    let mut count = 0;

    for i in 0..array.length() {
        let value = array.get(i).as_f64().unwrap();

        match count {
            0 => current_sensor_reading.x = value,
            1 => current_sensor_reading.y = value,
            2 => current_sensor_reading.signal_strength = value,
            3 => {
                current_sensor_reading.bt_id = value as i32;
                sensor_readings.push(current_sensor_reading);
                current_sensor_reading = SensorReading { x: 0.0, y: 0.0, signal_strength: 0.0, bt_id: 0 };
                count = -1;
            },
            _ => (),
        }

        count += 1;
    }

    sensor_readings
}

fn group_bId(sensors_readings: Vec<SensorReading>) -> HashMap<i32, Vec<SensorReading>> {
    let mut map: HashMap<i32, Vec<SensorReading>> = HashMap::new();

    for sensor_reading in sensors_readings {
        let bt_id = sensor_reading.bt_id;

        if map.contains_key(&bt_id) {
            let mut sensor_readings = map.get_mut(&bt_id).unwrap();
            sensor_readings.push(sensor_reading);
        } else {
            let mut sensor_readings: Vec<SensorReading> = Vec::new();
            sensor_readings.push(sensor_reading);
            map.insert(bt_id, sensor_readings);
        }
    }

    map
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    pub fn group_sensor_readings_by_bId() {
        let mut sensor_readings: Vec<SensorReading> = Vec::new();

        sensor_readings.push(SensorReading { x: 1.0, y: 8.0, signal_strength: 0.0, bt_id: 1 });
        sensor_readings.push(SensorReading { x: 2.0, y: 9.0, signal_strength: 0.0, bt_id: 1 });
        sensor_readings.push(SensorReading { x: 3.0, y: 10.0, signal_strength: 0.0, bt_id: 2 });
        sensor_readings.push(SensorReading { x: 4.0, y: 11.0, signal_strength: 0.0, bt_id: 2 });
        sensor_readings.push(SensorReading { x: 5.0, y: 12.0, signal_strength: 0.0, bt_id: 3 });
        sensor_readings.push(SensorReading { x: 6.0, y: 13.0, signal_strength: 0.0, bt_id: 3 });
        sensor_readings.push(SensorReading { x: 7.0, y: 14.0, signal_strength: 0.0, bt_id: 3 });

        let map = group_bId(sensor_readings);

        assert_eq!(map.len(), 3);
        assert_eq!(map.get(&1).unwrap().len(), 2);
        assert_eq!(map.get(&2).unwrap().len(), 2);
        assert_eq!(map.get(&3).unwrap().len(), 3);

        assert_eq!(map.get(&1).unwrap()[0].x, 1.0);
        assert_eq!(map.get(&1).unwrap()[0].y, 8.0);
        assert_eq!(map.get(&1).unwrap()[1].x, 2.0);
        assert_eq!(map.get(&1).unwrap()[1].y, 9.0);

        assert_eq!(map.get(&2).unwrap()[0].x, 3.0);
        assert_eq!(map.get(&2).unwrap()[0].y, 10.0);
        assert_eq!(map.get(&2).unwrap()[1].x, 4.0);
        assert_eq!(map.get(&2).unwrap()[1].y, 11.0);

        assert_eq!(map.get(&3).unwrap()[0].x, 5.0);
        assert_eq!(map.get(&3).unwrap()[0].y, 12.0);
        assert_eq!(map.get(&3).unwrap()[1].x, 6.0);
        assert_eq!(map.get(&3).unwrap()[1].y, 13.0);
        assert_eq!(map.get(&3).unwrap()[2].x, 7.0);
        assert_eq!(map.get(&3).unwrap()[2].y, 14.0);
    }
}