import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "{VALUE} is not a valid email address!"
      }
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      lowercase: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      lowercase: true
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, "Age must be at least 18"],
      max: [65, "Age must be at most 65"]
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not supported only male,female and other are supported"
      },
      required: [true, 'Gender is required']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, "Password must be at least 8 characters long"],
      match: [
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        "Password must contain at least one uppercase letter, one number, and one special character"
      ]
    },
    photoUrl: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      trim: true,
      match: [
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
        "Please enter a valid image URL"
      ]
    },
    skills: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (skillsArray: string[]) => {
            return skillsArray.length <= 10;
          },
          message: "A profile can have a maximum of 10 skills"
        },
        {
          validator: (skillsArray: string[]) => {
            const uniqueSkills = new Set(skillsArray);
            return uniqueSkills.size === skillsArray.length;
          },
          message: "Skills must be unique"
        }
      ]
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {

  console.log(this)
  if (!this.isModified("password")) {
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password as string, saltRounds);
});

export const user = mongoose.model('users', userSchema);
