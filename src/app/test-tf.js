import * as tf from '@tensorflow/tfjs-node';

// Simple operation
const a = tf.tensor1d([1, 2, 3]);
const b = tf.tensor1d([4, 5, 6]);
const c = a.add(b);

c.print();
