/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Generator } from './components/Generator';
import { Collection } from './components/Collection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="generator" element={<Generator />} />
          <Route path="collection" element={<Collection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
