mod utils;

use std::collections::HashMap;

use js_sys::Array;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn main_js() -> Result<(), JsValue> {
    #[cfg(debug_assertions)]
    set_panic_hook();

    Ok(())
}

#[wasm_bindgen]
extern "C" {
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
struct SensorReading {
    x: f64,
    y: f64,
    signal_strength: f64,
    bt_id: i32,
}

//
// Main function that is called from Typescript to transform the sensor matrices.
// The function takes an array of floats that represent the sensor readings
// and returns an array of floats that represent the transformed sensor readings.
//
// Takes an array of the form:
// [x_1, y_1, signal_strength_1, btId_1, x_2, y_2, signal_strength_2, btId_2, x_3, y_3, signal_strength_3, btId_3 ...]
//
// and returns an array of the form:
// [btId, signal_strength_1, signal_strength_2, signal_strength_3, x_1, y_1, x_2, y_2, x_3, y_3, translation_x, translation_y ...]
//
// Each 12 elements represent one bluetooth device's tracking data to be fed into a neural network.
//

#[wasm_bindgen]
pub fn transform_sensor_matrices(array: Array) -> Array {
    let return_array = Array::new();

    let sensor_readings = transform_to_sensor_readings(array);

    let grouped_sensor_readings = group_bid(sensor_readings);

    for (key, value) in grouped_sensor_readings {
        let usable_readings = get_usable_readings(value);

        // transform data and add to array
        let translation_matrix = get_translation_matrix(&usable_readings);
        let translated_sensor_readings = translate_sensors(&usable_readings, &translation_matrix);

        return_array.push(&JsValue::from(key));

        return_array.push(&JsValue::from(
            translated_sensor_readings[0].signal_strength,
        ));
        return_array.push(&JsValue::from(
            translated_sensor_readings[1].signal_strength,
        ));
        return_array.push(&JsValue::from(
            translated_sensor_readings[2].signal_strength,
        ));

        return_array.push(&JsValue::from(translated_sensor_readings[0].x));
        return_array.push(&JsValue::from(translated_sensor_readings[0].y));
        return_array.push(&JsValue::from(translated_sensor_readings[1].x));
        return_array.push(&JsValue::from(translated_sensor_readings[1].y));
        return_array.push(&JsValue::from(translated_sensor_readings[2].x));
        return_array.push(&JsValue::from(translated_sensor_readings[2].y));

        return_array.push(&JsValue::from(translation_matrix.x));
        return_array.push(&JsValue::from(translation_matrix.y));
    }

    return_array
}

//
// Main function that is called from Typescript to reverse transform the device coordinates.
// The function takes an array of floats that represent the device coordinates and translation matrix
// and returns an array of floats that represent the transformed device coordinates.
//
// Takes an array of the form:
// [btid, x, y, translation_x, translation_y ...]
//
// And returns an array of the form:
// [btid, x, y, ...]
//

#[wasm_bindgen]
pub fn reverse_transform_devices(array: Array) -> Array {
    let return_array = Array::new();

    let mut count = 0;

    let mut bt_id = 0;
    let mut x = 0.0;
    let mut y = 0.0;
    let mut translation_x = 0.0;

    for i in 0..array.length() {
        let value = array.get(i).as_f64().unwrap();

        match count {
            0 => bt_id = value as i32,
            1 => x = value,
            2 => y = value,
            3 => translation_x = value,
            4 => {
                return_array.push(&JsValue::from(bt_id));
                return_array.push(&JsValue::from(x + translation_x));
                return_array.push(&JsValue::from(y + value));

                count = -1;
            },
            _ => (),
        }

        count += 1;
    }

    return_array
}

fn transform_to_sensor_readings(array: Array) -> Vec<SensorReading> {
    let mut sensor_readings: Vec<SensorReading> = Vec::new();

    let mut current_sensor_reading: SensorReading = SensorReading {
        x: 0.0,
        y: 0.0,
        signal_strength: 0.0,
        bt_id: 0,
    };
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
                current_sensor_reading = SensorReading {
                    x: 0.0,
                    y: 0.0,
                    signal_strength: 0.0,
                    bt_id: 0,
                };
                count = -1;
            }
            _ => (),
        }

        count += 1;
    }

    sensor_readings
}

fn group_bid(sensors_readings: Vec<SensorReading>) -> HashMap<i32, Vec<SensorReading>> {
    let mut map: HashMap<i32, Vec<SensorReading>> = HashMap::new();

    for sensor_reading in sensors_readings {
        let bt_id = sensor_reading.bt_id;

        if map.contains_key(&bt_id) {
            let sensor_readings = map.get_mut(&bt_id).unwrap();
            sensor_readings.push(sensor_reading);
        } else {
            let mut sensor_readings: Vec<SensorReading> = Vec::new();
            sensor_readings.push(sensor_reading);
            map.insert(bt_id, sensor_readings);
        }
    }

    map
}

fn get_usable_readings(mut sensors_readings: Vec<SensorReading>) -> Vec<SensorReading> {
    // sort by signal strength
    sensors_readings.sort_by(|a, b| b.signal_strength.partial_cmp(&a.signal_strength).unwrap());

    // pop elements until only 3 are left

    while sensors_readings.len() > 3 {
        sensors_readings.pop();
    }

    sensors_readings
}

fn get_translation_matrix(sensor_readings: &Vec<SensorReading>) -> TranslationMatrix {
    // get the average x and y values
    let mut x_sum = 0.0;
    let mut y_sum = 0.0;

    for sensor_reading in sensor_readings {
        x_sum += sensor_reading.x;
        y_sum += sensor_reading.y;
    }

    let x_avg = x_sum / 3 as f64;
    let y_avg = y_sum / 3 as f64;

    TranslationMatrix { x: x_avg, y: y_avg }
}

fn translate_sensors(
    sensor_readings: &Vec<SensorReading>,
    translation_matrix: &TranslationMatrix,
) -> Vec<SensorReading> {
    let mut translated_sensor_readings: Vec<SensorReading> = Vec::new();

    for sensor_reading in sensor_readings {
        let x = sensor_reading.x - translation_matrix.x;
        let y = sensor_reading.y - translation_matrix.y;

        translated_sensor_readings.push(SensorReading {
            x,
            y,
            signal_strength: sensor_reading.signal_strength,
            bt_id: sensor_reading.bt_id,
        });
    }

    translated_sensor_readings
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    pub fn test_group_bid() {
        let mut sensor_readings: Vec<SensorReading> = Vec::new();

        sensor_readings.push(SensorReading {
            x: 1.0,
            y: 8.0,
            signal_strength: 0.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 2.0,
            y: 9.0,
            signal_strength: 0.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 3.0,
            y: 10.0,
            signal_strength: 0.0,
            bt_id: 2,
        });
        sensor_readings.push(SensorReading {
            x: 4.0,
            y: 11.0,
            signal_strength: 0.0,
            bt_id: 2,
        });
        sensor_readings.push(SensorReading {
            x: 5.0,
            y: 12.0,
            signal_strength: 0.0,
            bt_id: 3,
        });
        sensor_readings.push(SensorReading {
            x: 6.0,
            y: 13.0,
            signal_strength: 0.0,
            bt_id: 3,
        });
        sensor_readings.push(SensorReading {
            x: 7.0,
            y: 14.0,
            signal_strength: 0.0,
            bt_id: 3,
        });

        let map = group_bid(sensor_readings);

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

    #[test]
    pub fn test_get_usable_readings() {
        let mut sensor_readings: Vec<SensorReading> = Vec::new();

        sensor_readings.push(SensorReading {
            x: 1.0,
            y: 8.0,
            signal_strength: 1.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 2.0,
            y: 9.0,
            signal_strength: 2.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 3.0,
            y: 10.0,
            signal_strength: 7.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 4.0,
            y: 11.0,
            signal_strength: 5.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 5.0,
            y: 12.0,
            signal_strength: 3.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 6.0,
            y: 13.0,
            signal_strength: 6.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 7.0,
            y: 14.0,
            signal_strength: 4.0,
            bt_id: 1,
        });

        let usable_readings = get_usable_readings(sensor_readings);

        assert_eq!(usable_readings.len(), 3);
        assert_eq!(usable_readings[0].x, 3.0);
        assert_eq!(usable_readings[0].y, 10.0);
        assert_eq!(usable_readings[1].x, 6.0);
        assert_eq!(usable_readings[1].y, 13.0);
        assert_eq!(usable_readings[2].x, 4.0);
        assert_eq!(usable_readings[2].y, 11.0);
    }

    #[test]
    pub fn test_get_translation_matrix() {
        let mut sensor_readings: Vec<SensorReading> = Vec::new();

        sensor_readings.push(SensorReading {
            x: 1.0,
            y: 2.0,
            signal_strength: 0.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 4.0,
            y: 3.0,
            signal_strength: 0.0,
            bt_id: 1,
        });
        sensor_readings.push(SensorReading {
            x: 3.0,
            y: 5.0,
            signal_strength: 0.0,
            bt_id: 1,
        });

        let translation_matrix = get_translation_matrix(&sensor_readings);

        assert_eq!(translation_matrix.x, 8.0 / 3.0);
        assert_eq!(translation_matrix.y, 10.0 / 3.0);
    }
}
