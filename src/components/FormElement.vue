<!--
  - Copyright 2023 gematik GmbH
  -
  - The Authenticator App is licensed under the European Union Public Licence (EUPL); every use of the Authenticator App
  - Sourcecode must be in compliance with the EUPL.
  -
  - You will find more details about the EUPL here: https://joinup.ec.europa.eu/collection/eupl
  -
  - Unless required by applicable law or agreed to in writing, software distributed under the EUPL is distributed on an "AS
  - IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the EUPL for the specific
  - language governing permissions and limitations under the License.ee the Licence for the specific language governing
  - permissions and limitations under the Licence.
  -->

<!-- eslint-disable vue/no-mutating-props -->

<template>
  <div
    v-if="hide !== true"
    class="form-element-container flex justify-between items-center px-[48px] py-[8px] bg-neutral inner-box-shadow"
  >
    <div class="w-[200px]">
      <label :for="`form-${name}`" class="font-bold"> {{ label }} </label>
    </div>
    <div>
      <input
        v-if="type === 'input' || type === 'password' || type === 'email' || type === 'number'"
        :id="`form-${name}`"
        v-model="model[name]"
        :placeholder="placeholder"
        :disabled="disabled"
        :type="type"
        :required="required"
        class="settings-input"
        @change="onLocalChange"
        @blur="onLocalChange"
      />
      <textarea
        v-if="type === 'text'"
        :id="`form-${name}`"
        v-model="model[name]"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="settings-input"
        @change="onLocalChange"
        @blur="onLocalChange"
      />
      <select
        v-else-if="type === 'drop-down'"
        :id="`form-${name}`"
        v-model="model[name]"
        :disabled="disabled"
        :required="required"
        class="settings-input"
        @change="onLocalChange"
        @blur="onLocalChange"
      >
        <option v-for="(boolOpt, index) in getOptions()" :key="index" :value="boolOpt.value">
          {{ boolOpt.text }}
        </option>
      </select>
      <div v-if="!isValid" class="text-error text-[12px] px-[15px] pt-[5px]">Wert ist nicht gültig</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TFormInputColumnTypes, TFormInputDropDownOptions, TFormInputDropDownOptionType } from '~/constants'

export default defineComponent({
  name: 'FormElement',
  props: {
    model: {
      type: Object,
      required: true
    },
    required: {
      type: Boolean,
      required: true
    },
    iterable: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      type: String as PropType<TFormInputColumnTypes>,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    optionsType: {
      type: String as PropType<TFormInputDropDownOptionType>,
      required: false,
      default: () => ''
    },
    options: {
      type: Array as PropType<TFormInputDropDownOptions[]>,
      required: false,
      default: () => []
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    validationRegex: {
      type: RegExp,
      required: false,
      default: null
    },
    hide: {
      type: Boolean,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    infoText: {
      type: String,
      required: false,
      default: ''
    },
    /**
     * Get fired for whole form any time an element changes
     */
    onFormChange: {
      type: Function,
      required: false,
      default: (): void => {}
    },
    /**
     * Get fired only for the element's listener
     */
    onElementChange: {
      type: Function,
      required: false,
      default: (): void => {}
    },
    accept: {
      type: String,
      required: false,
      default: '.pem'
    }
  },
  data() {
    return {
      isValid: true
    }
  },
  created() {
    this.validate()
  },
  methods: {
    /**
     * after each change we call this method and this method fires prop onFormChange
     */
    onLocalChange(): void {
      this.validate()

      this.onFormChange()

      this.onElementChange(this.model[this.name])
    },
    getOptions(): TFormInputDropDownOptions[] {
      if (this.options?.length) {
        return this.options
      } else if (this.optionsType) {
        const optionTypes = {
          boolean: [
            { text: 'Enabled', value: true },
            { text: 'Disabled', value: false }
          ]
        }

        return optionTypes[this.optionsType]
      }
      return []
    },
    validate() {
      this.isValid = !(
        this.model[this.name] && // if there is a value
        this.validationRegex && // if there is a regex
        // if the regex does not match the value
        !this.validationRegex.test(this.model[this.name])
      )
    }
  }
})
</script>

<style>
.settings-input {
  width: 300px;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  box-sizing: border-box;
  outline: none;
}
</style>
